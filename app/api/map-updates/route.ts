import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@/app/generated/prisma";

// Alternative Prisma client for debugging
const directPrisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Set up Server-Sent Events headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: "connection",
        message: "Connected to Live Karma Map",
      })}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialMessage));

      // Send real data from database
      const sendRealData = async () => {
        try {
          const prismaClient = prisma.lostFoundItem ? prisma : directPrisma;

          // Fetch recent lost/found items
          const lostFoundItems = await prismaClient.lostFoundItem.findMany({
            where: {
              status: "active",
              location_coordinates: { not: null },
            },
            include: {
              user: {
                select: { name: true },
              },
            },
            orderBy: { created_at: "desc" },
            take: 10,
          });

          // Fetch recent crime reports
          const crimeReports = await prismaClient.crimeReport.findMany({
            where: {
              status: { not: "closed" },
              location_coordinates: { not: null },
            },
            include: {
              user: {
                select: { name: true },
              },
            },
            orderBy: { created_at: "desc" },
            take: 10,
          });

          // Send lost/found items
          for (const item of lostFoundItems) {
            if (
              item.location_coordinates &&
              typeof item.location_coordinates === "object"
            ) {
              const coords = item.location_coordinates as {
                lat: number;
                lng: number;
              };
              const markerData = {
                id: `lost-found-${item.id}`,
                lat: coords.lat,
                lng: coords.lng,
                type: "lost_found",
                subtype: item.type,
                category: item.category,
                name: item.name,
                description: item.description,
                location: item.location,
                contact_name: item.contact_name,
                contact_phone: item.contact_phone,
                image_url: item.image_url,
                created_at: item.created_at.toISOString(),
                user_name: item.user.name,
                severity: item.type === "lost" ? "medium" : "low",
              };

              const message = `data: ${JSON.stringify(markerData)}\n\n`;
              controller.enqueue(new TextEncoder().encode(message));
            }
          }

          // Send crime reports
          for (const report of crimeReports) {
            if (
              report.location_coordinates &&
              typeof report.location_coordinates === "object"
            ) {
              const coords = report.location_coordinates as {
                lat: number;
                lng: number;
              };
              const markerData = {
                id: `crime-${report.id}`,
                lat: coords.lat,
                lng: coords.lng,
                type: "crime",
                subtype: report.crime_type,
                severity: report.severity,
                description: report.description,
                location: report.location,
                contact_name: report.contact_name,
                contact_phone: report.contact_phone,
                incident_date: report.incident_date?.toISOString(),
                image_url: report.image_url,
                created_at: report.created_at.toISOString(),
                user_name: report.is_anonymous ? "Anonymous" : report.user.name,
                is_anonymous: report.is_anonymous,
              };

              const message = `data: ${JSON.stringify(markerData)}\n\n`;
              controller.enqueue(new TextEncoder().encode(message));
            }
          }

          // Send some simulated karma events for positive actions
          const sendKarmaEvent = () => {
            const lat = 23.1793 + (Math.random() - 0.5) * 0.01;
            const lng = 75.7873 + (Math.random() - 0.5) * 0.01;
            const intensity = Math.random() * 100;

            const karmaEvent = {
              id: `karma-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              lat: parseFloat(lat.toFixed(6)),
              lng: parseFloat(lng.toFixed(6)),
              type: "karma",
              intensity: Math.round(intensity),
              timestamp: new Date().toISOString(),
              action: getRandomKarmaAction(),
            };

            const message = `data: ${JSON.stringify(karmaEvent)}\n\n`;
            controller.enqueue(new TextEncoder().encode(message));
          };

          // Send karma events every 10-15 seconds
          const karmaInterval = setInterval(() => {
            sendKarmaEvent();
          }, Math.random() * 5000 + 10000);

          // Cleanup karma interval
          const cleanupKarma = () => clearInterval(karmaInterval);
          request.signal.addEventListener("abort", cleanupKarma);
        } catch (error) {
          console.error("Error fetching real data:", error);
        }
      };

      // Send real data immediately
      sendRealData();

      // Send real data updates every 30 seconds
      const realDataInterval = setInterval(() => {
        sendRealData();
      }, 30000);

      // Cleanup function
      const cleanup = () => {
        clearInterval(realDataInterval);
        controller.close();
      };

      // Handle client disconnect
      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, { headers });
}

// Helper function to generate random karma actions
function getRandomKarmaAction(): string {
  const actions = [
    "Helped someone carry groceries",
    "Donated to charity",
    "Volunteered at community center",
    "Helped elderly cross the street",
    "Cleaned up litter",
    "Shared food with homeless",
    "Helped lost tourist",
    "Donated blood",
    "Planting trees",
    "Teaching children",
    "Helping at food bank",
    "Community service",
    "Environmental cleanup",
    "Supporting local business",
    "Helping neighbor with chores",
  ];

  return actions[Math.floor(Math.random() * actions.length)];
}
