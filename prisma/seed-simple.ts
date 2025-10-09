import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

// Simple seed data that won't conflict with existing data
const sampleItems = [
  {
    id: "seed_lost_001",
    userId: "user_32V5ypzOiWAKNYn8idNcQy4T0Tw", // Use existing user ID from terminal output
    type: "lost" as const,
    category: "item" as const,
    name: "Lost iPhone 15",
    description:
      "Lost my iPhone 15 during the mela. It has a black case and was last seen near the main entrance.",
    location: "Near Main Entrance, Simhastha Mela Ground",
    contact_name: "Test User",
    contact_phone: "+919876543210",
    contact_email: "test@example.com",
    status: "pending" as const,
  },
  {
    id: "seed_found_001",
    userId: "user_32V5ypzOiWAKNYn8idNcQy4T0Tw",
    type: "found" as const,
    category: "item" as const,
    name: "Found Gold Chain",
    description:
      "Found a beautiful gold chain near the temple. Owner please contact with identification.",
    location: "Near Mahakaleshwar Temple, Ujjain",
    contact_name: "Test User",
    contact_phone: "+919876543210",
    contact_email: "test@example.com",
    status: "active" as const,
  },
  {
    id: "seed_lost_002",
    userId: "user_32V5ypzOiWAKNYn8idNcQy4T0Tw",
    type: "lost" as const,
    category: "person" as const,
    name: "Lost Elderly Person",
    description:
      "My 75-year-old father went missing during the evening aarti. He is wearing white kurta.",
    location: "Near Ram Ghat, Ujjain",
    contact_name: "Test User",
    contact_phone: "+919876543210",
    contact_email: "test@example.com",
    status: "pending" as const,
  },
];

async function seedSimple() {
  console.log("🌱 Starting simple seed process...");

  try {
    // Just create items without cleanup
    console.log("📦 Creating sample lost & found items...");

    for (const item of sampleItems) {
      try {
        await prisma.lostFoundItem.create({
          data: item,
        });
        console.log(`   ✅ Created ${item.type} item: ${item.name}`);
      } catch (error: any) {
        if (error.code === "P2002") {
          console.log(`   ⚠️ Item already exists: ${item.name} (skipping)`);
        } else {
          console.error(
            `   ❌ Error creating item ${item.name}:`,
            error.message
          );
        }
      }
    }

    console.log("🎉 Simple seed process completed!");
    console.log(
      "\n📊 You can now test the lost & found functionality with sample data."
    );
  } catch (error) {
    console.error("❌ Error in simple seed process:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedSimple()
  .then(() => {
    console.log("\n✅ Simple seed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Simple seed failed:", error);
    process.exit(1);
  });
