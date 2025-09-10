import { z } from "zod";
import { prisma } from "./prisma";

export const databaseTool = {
  awardPunyaPoints: {
    description:
      "Awards Punya Points to a user for a specific action and logs the action.",
    parameters: z.object({
      userId: z.string().describe("The ID of the user to award points to."),
      actionName: z.string().describe("The name of the action performed."),
      location: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
      imageUrl: z
        .string()
        .url()
        .optional()
        .describe("Optional image URL evidence associated with the action."),
    }),
    execute: async ({
      userId,
      actionName,
      location,
      imageUrl,
    }: {
      userId: string;
      actionName: string;
      location?: { lat: number; lng: number };
      imageUrl?: string;
    }) => {
      try {
        let action = await prisma.action.findUnique({
          where: { action_name: actionName },
        });

        if (!action) {
          // Fallback: create the action if it's one of our known canonical names
          const defaultPoints: Record<string, number> = {
            dispose_waste_qr: 20,
            report_hygiene_issue_photo: 30,
            verify_hygiene_issue_resolved: 50,
            refill_water_station_qr: 25,
            use_public_transport_or_erickshaw: 15,
            attend_cultural_event_checkin: 10,
            help_lost_pilgrim_sos: 40,
            share_cultural_story_featured: 15,
          };
          if (actionName in defaultPoints) {
            action = await prisma.action.create({
              data: {
                action_name: actionName,
                point_value: defaultPoints[actionName],
              },
            });
          } else {
            return { success: false, error: "Action not found." };
          }
        }

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            totalPunyaPoints: {
              increment: action.point_value,
            },
          },
        });

        await prisma.userAction.create({
          data: {
            userId,
            actionId: action.id,
            location_geopoint: location ? JSON.stringify(location) : undefined,
            image_url: imageUrl,
          },
        });

        return {
          success: true,
          newTotalPoints: updatedUser.totalPunyaPoints,
          pointsAwarded: action.point_value,
          actionName: action.action_name,
        };
      } catch (error) {
        console.error("Error awarding points:", error);
        return { success: false, error: "Failed to award points." };
      }
    },
  },

  getUserProfile: {
    description:
      "Gets comprehensive user profile including points, recent actions, and statistics.",
    parameters: z.object({
      userId: z.string().describe("The ID of the user."),
    }),
    execute: async ({ userId }: { userId: string }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            userActions: {
              include: {
                action: true,
              },
              orderBy: {
                timestamp: "desc",
              },
              take: 10, // Last 10 actions
            },
          },
        });

        if (!user) {
          return { success: false, error: "User not found." };
        }

        // Calculate statistics
        const totalActions = user.userActions.length;
        const uniqueActions = new Set(user.userActions.map((ua) => ua.actionId))
          .size;
        const recentActions = user.userActions.slice(0, 5);

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            phone_number: user.phone_number,
            language_preference: user.language_preference,
            totalPunyaPoints: user.totalPunyaPoints,
            totalActions,
            uniqueActions,
            recentActions: recentActions.map((ua) => ({
              actionName: ua.action.action_name,
              points: ua.action.point_value,
              timestamp: ua.timestamp,
              location: ua.location_geopoint,
            })),
          },
        };
      } catch (error) {
        console.error("Error getting user profile:", error);
        return { success: false, error: "Failed to get user profile." };
      }
    },
  },

  getLeaderboard: {
    description: "Gets the top users by total Punya Points for a leaderboard.",
    parameters: z.object({
      limit: z
        .number()
        .optional()
        .describe("Number of top users to return (default: 10)."),
    }),
    execute: async ({ limit = 10 }: { limit?: number }) => {
      try {
        const topUsers = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            totalPunyaPoints: true,
            userActions: {
              select: {
                action: {
                  select: {
                    action_name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            totalPunyaPoints: "desc",
          },
          take: limit,
        });

        const leaderboard = topUsers.map((user, index) => ({
          rank: index + 1,
          name: user.name || "Anonymous Tourist",
          totalPoints: user.totalPunyaPoints,
          totalActions: user.userActions.length,
        }));

        return {
          success: true,
          leaderboard,
        };
      } catch (error) {
        console.error("Error getting leaderboard:", error);
        return { success: false, error: "Failed to get leaderboard." };
      }
    },
  },

  getUserAchievements: {
    description:
      "Gets user's achievements and milestones based on their actions.",
    parameters: z.object({
      userId: z.string().describe("The ID of the user."),
    }),
    execute: async ({ userId }: { userId: string }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            userActions: {
              include: {
                action: true,
              },
            },
          },
        });

        if (!user) {
          return { success: false, error: "User not found." };
        }

        const achievements = [];
        const actions = user.userActions.map((ua) => ua.action.action_name);

        // Check for achievements
        if (user.totalPunyaPoints >= 1000) {
          achievements.push({
            name: "Spiritual Master",
            description: "Earned 1000+ Punya Points",
            icon: "🏆",
            unlocked: true,
          });
        } else if (user.totalPunyaPoints >= 500) {
          achievements.push({
            name: "Devoted Pilgrim",
            description: "Earned 500+ Punya Points",
            icon: "🥇",
            unlocked: true,
          });
        } else if (user.totalPunyaPoints >= 100) {
          achievements.push({
            name: "Blessed Visitor",
            description: "Earned 100+ Punya Points",
            icon: "🥈",
            unlocked: true,
          });
        }

        if (actions.includes("visit_mahakaleshwar_temple")) {
          achievements.push({
            name: "Mahakaleshwar Darshan",
            description: "Visited the sacred Mahakaleshwar Temple",
            icon: "🕉️",
            unlocked: true,
          });
        }

        if (
          actions.filter((a) => a.includes("visit_") && a.includes("_temple"))
            .length >= 5
        ) {
          achievements.push({
            name: "Temple Explorer",
            description: "Visited 5+ temples in Ujjain",
            icon: "🏛️",
            unlocked: true,
          });
        }

        if (
          actions.includes("take_temple_photo") ||
          actions.includes("take_ritual_photo")
        ) {
          achievements.push({
            name: "Memory Keeper",
            description: "Captured sacred moments",
            icon: "📸",
            unlocked: true,
          });
        }

        return {
          success: true,
          achievements,
          totalAchievements: achievements.length,
        };
      } catch (error) {
        console.error("Error getting achievements:", error);
        return { success: false, error: "Failed to get achievements." };
      }
    },
  },

  createUser: {
    description: "Creates a new user in the system.",
    parameters: z.object({
      phone_number: z.string().describe("User's phone number."),
      name: z.string().optional().describe("User's name."),
      language_preference: z
        .string()
        .optional()
        .describe("User's preferred language."),
    }),
    execute: async ({
      phone_number,
      name,
      language_preference,
    }: {
      phone_number: string;
      name?: string;
      language_preference?: string;
    }) => {
      try {
        const user = await prisma.user.create({
          data: {
            phone_number,
            name,
            language_preference,
            totalPunyaPoints: 0,
          },
        });

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            phone_number: user.phone_number,
            language_preference: user.language_preference,
            totalPunyaPoints: user.totalPunyaPoints,
          },
        };
      } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: "Failed to create user." };
      }
    },
  },
};
