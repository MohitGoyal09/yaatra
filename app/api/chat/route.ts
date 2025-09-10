import { google } from "@ai-sdk/google";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
  ToolSet,
} from "ai";
import { prisma } from "@/lib/prisma";
import { databaseTool } from "@/lib/database-tool";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId: authUserId } = await auth();
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      authUserId ||
      undefined;

    // Ensure app user exists keyed by stable identity (email/phone)
    let dbUserId: string | undefined = undefined;
    if (identityKey) {
      const upserted = await prisma.user.upsert({
        where: { phone_number: identityKey },
        update: {},
        create: {
          phone_number: identityKey,
          name: clerk?.fullName || clerk?.username || undefined,
          language_preference: "English",
          totalPunyaPoints: 0,
        },
      });
      dbUserId = upserted.id;
    }
    const {
      messages,
      model,
      webSearch,
      userId: requestUserId,
    }: {
      messages: UIMessage[];
      model?: string;
      webSearch?: boolean;
      userId?: string;
    } = await req.json();

    // Map client-provided model string to Google provider instance
    const resolveModel = () => {
      const fallback = google("gemini-2.5-flash");
      if (!model) return fallback;
      if (model.startsWith("google/")) {
        const id = model.split("/")[1] || "gemini-2.5-flash";
        return google(id);
      }
      // Fallback to Google if unknown provider id is passed
      return fallback;
    };

    const toolsObj = webSearch
      ? { google_search: google.tools.googleSearch({}) }
      : ({
          updateUserPoints: tool({
            description:
              "Awards Punya Points for a specific action. The points come from the Action table; do not pass client-provided point values.",
            inputSchema: z.object({
              userId: z.string().optional().describe("The ID of the user"),
              actionName: z
                .string()
                .describe(
                  "Machine name for the action (e.g., dispose_waste_qr, refill_water_station_qr)"
                ),
              location: z
                .object({ lat: z.number(), lng: z.number() })
                .optional()
                .describe("Optional geolocation where the action happened"),
              imageUrl: z
                .string()
                .url()
                .optional()
                .describe("Optional image URL as evidence"),
            }),
            execute: async ({
              userId,
              actionName,
              location,
              imageUrl,
            }: {
              userId?: string;
              actionName: string;
              location?: { lat: number; lng: number };
              imageUrl?: string;
            }) => {
              const resolvedUserId =
                dbUserId ?? requestUserId ?? userId ?? authUserId;
              if (!resolvedUserId)
                return { success: false, error: "User ID missing" };
              return databaseTool.awardPunyaPoints.execute({
                userId: resolvedUserId,
                actionName,
                location,
                imageUrl,
              });
            },
          }),
          fetchUserPoints: tool({
            description: "Fetches the user's current total Punya Points.",
            inputSchema: z.object({
              userId: z.string().optional().describe("The ID of the user"),
            }),
            execute: async ({ userId }: { userId?: string }) => {
              try {
                const resolvedUserId =
                  dbUserId ?? requestUserId ?? userId ?? authUserId;
                if (!resolvedUserId)
                  return { success: false, error: "User ID missing" };
                const user = await prisma.user.findUnique({
                  where: { id: resolvedUserId },
                  select: { totalPunyaPoints: true, name: true },
                });
                if (!user) return { success: false, error: "User not found" };
                return {
                  success: true,
                  totalPoints: user.totalPunyaPoints,
                  userName: user.name ?? "Tourist",
                };
              } catch (error) {
                return { success: false, error: "Failed to fetch points." };
              }
            },
          }),
        } as Record<string, unknown>);

    const result = streamText({
      model: resolveModel(),
      messages: convertToModelMessages(messages),
      tools: toolsObj as ToolSet,
      stopWhen: stepCountIs(5),
      system: `You are a helpful Ujjain tourism assistant. Current user id: ${
        requestUserId ?? authUserId ?? "unknown"
      }.
      You can answer general questions about Ujjain tourism, temples, culture, history, routes, timings, and itineraries.
      ${
        webSearch
          ? "Web search is enabled: use google_search when the user explicitly asks for real-time/latest updates or current events."
          : "Web search is disabled in this chat: answer from general knowledge and note that details may vary on the day."
      }
      If a question needs live data (e.g., "today's traffic"), give the best static guidance and mention that details may vary on the day.
      When the user asks about their Punya Points balance, ALWAYS call fetchUserPoints (use the current user id when not provided) and return the result.
      When the user reports completing an action, map it to an action name and call updateUserPoints (optionally pass imageUrl/location if provided). Do not compute point values yourself; the backend determines them.
      Action names: Hygiene & Health: dispose_waste_qr (+20), report_hygiene_issue_photo (+30), verify_hygiene_issue_resolved (+50). Eco-Friendliness: refill_water_station_qr (+25), use_public_transport_or_erickshaw (+15). Cultural & Community: attend_cultural_event_checkin (+10), help_lost_pilgrim_sos (+40), share_cultural_story_featured (+15).
      Be concise, friendly, and culturally respectful.`,
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
