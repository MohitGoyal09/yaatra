import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function seedLostFoundData() {
  console.log("🌱 Seeding lost and found data...");

  // Get existing users or create demo users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { phone_number: "demo1@yaat.com" },
      update: {},
      create: {
        phone_number: "demo1@yaat.com",
        name: "Priya Sharma",
        language_preference: "Hindi",
        totalPunyaPoints: 150,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "demo2@yaat.com" },
      update: {},
      create: {
        phone_number: "demo2@yaat.com",
        name: "Rajesh Kumar",
        language_preference: "English",
        totalPunyaPoints: 200,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "demo3@yaat.com" },
      update: {},
      create: {
        phone_number: "demo3@yaat.com",
        name: "Sunita Patel",
        language_preference: "Gujarati",
        totalPunyaPoints: 175,
      },
    }),
  ]);

  // Create sample lost and found items
  const sampleItems = [
    {
      type: "lost",
      category: "item",
      name: "Gold Chain with Om Pendant",
      description:
        "Lost my gold chain with Om pendant near Mahakal Temple. It's a family heirloom with sentimental value. The chain is 22k gold and the pendant has intricate Om design. Please help me find it.",
      location: "Near Mahakal Temple, Ujjain",
      contact_name: "Priya Sharma",
      contact_phone: "+91 9876543210",
      contact_email: "priya@example.com",
      contact_address: "123 Temple Road, Ujjain",
      userId: users[0].id,
    },
    {
      type: "found",
      category: "document",
      name: "Aadhaar Card Found",
      description:
        "Found an Aadhaar card near the ghats. Name: Rajesh Kumar, DOB: 15/03/1990. Please contact me if this belongs to you or someone you know.",
      location: "Near Ram Ghat, Ujjain",
      contact_name: "Sunita Patel",
      contact_phone: "+91 9876543211",
      contact_email: "sunita@example.com",
      contact_address: "456 Ghat Road, Ujjain",
      userId: users[2].id,
    },
    {
      type: "lost",
      category: "pet",
      name: "Missing Golden Retriever - Max",
      description:
        "Lost my 3-year-old Golden Retriever named Max. He's very friendly and responds to his name. Last seen near Harsiddhi Temple. He has a blue collar with contact details. Please help us find him.",
      location: "Near Harsiddhi Temple, Ujjain",
      contact_name: "Rajesh Kumar",
      contact_phone: "+91 9876543212",
      contact_email: "rajesh@example.com",
      contact_address: "789 Temple Street, Ujjain",
      userId: users[1].id,
    },
    {
      type: "found",
      category: "item",
      name: "Mobile Phone Found",
      description:
        "Found a Samsung Galaxy phone near the bus stand. The phone is locked but I can see it has a blue case. Please contact me with the phone details to claim it.",
      location: "Near Ujjain Bus Stand",
      contact_name: "Priya Sharma",
      contact_phone: "+91 9876543210",
      contact_email: "priya@example.com",
      contact_address: "123 Temple Road, Ujjain",
      userId: users[0].id,
    },
    {
      type: "lost",
      category: "person",
      name: "Missing Elderly Person - Ramesh Ji",
      description:
        "My father Ramesh (75 years old) went missing from the temple area. He was wearing a white kurta and has difficulty walking. He might be confused about directions. Please help us find him.",
      location: "Mahakal Temple Area, Ujjain",
      contact_name: "Sunita Patel",
      contact_phone: "+91 9876543211",
      contact_email: "sunita@example.com",
      contact_address: "456 Ghat Road, Ujjain",
      userId: users[2].id,
    },
    {
      type: "found",
      category: "item",
      name: "Wallet Found with Cash",
      description:
        "Found a brown leather wallet near the railway station. Contains cash, some cards, and ID. The owner can identify by describing the contents. Please contact me to claim.",
      location: "Near Ujjain Railway Station",
      contact_name: "Rajesh Kumar",
      contact_phone: "+91 9876543212",
      contact_email: "rajesh@example.com",
      contact_address: "789 Temple Street, Ujjain",
      userId: users[1].id,
    },
  ];

  // Create the items
  for (const itemData of sampleItems) {
    await prisma.lostFoundItem.create({
      data: itemData,
    });
  }

  console.log("✅ Lost and found data seeded successfully!");
  console.log(`📊 Created ${sampleItems.length} lost and found items`);
}

seedLostFoundData()
  .catch((e) => {
    console.error("❌ Error seeding lost and found data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
