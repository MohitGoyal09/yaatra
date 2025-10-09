import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

const sampleUsers = [
  {
    id: "user_seed_001",
    phone_number: "+919876543210",
    name: "Rahul Sharma",
    language_preference: "Hindi",
    totalPunyaPoints: 50,
    aadhaarNumber: "123456789012",
    isAadhaarVerified: true,
  },
  {
    id: "user_seed_002",
    phone_number: "+919876543211",
    name: "Priya Patel",
    language_preference: "Gujarati",
    totalPunyaPoints: 30,
    aadhaarNumber: "123456789013",
    isAadhaarVerified: true,
  },
  {
    id: "user_seed_003",
    phone_number: "+919876543212",
    name: "Amit Kumar",
    language_preference: "English",
    totalPunyaPoints: 70,
    aadhaarNumber: "123456789014",
    isAadhaarVerified: true,
  },
  {
    id: "user_seed_004",
    phone_number: "+919876543213",
    name: "Sneha Desai",
    language_preference: "Marathi",
    totalPunyaPoints: 25,
    aadhaarNumber: "123456789015",
    isAadhaarVerified: true,
  },
];

const sampleLostFoundItems = [
  {
    id: "lost_item_001",
    userId: "user_seed_001",
    type: "lost",
    category: "item",
    name: "iPhone 15 Pro",
    description:
      "Lost my iPhone 15 Pro during the mela. It has a black case and was last seen near the main entrance. Please contact if found.",
    location: "Near Main Entrance, Simhastha Mela Ground",
    contact_name: "Rahul Sharma",
    contact_phone: "+919876543210",
    contact_email: "rahul.sharma@example.com",
    contact_address: "123 Gandhi Road, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    location_coordinates: { lat: 23.1765, lng: 75.7885 },
    status: "pending",
  },
  {
    id: "found_item_001",
    userId: "user_seed_002",
    type: "found",
    category: "item",
    name: "Gold Necklace",
    description:
      "Found a beautiful gold necklace near the temple. It appears to be traditional Indian design. Owner please contact with identification.",
    location: "Near Mahakaleshwar Temple, Ujjain",
    contact_name: "Priya Patel",
    contact_phone: "+919876543211",
    contact_email: "priya.patel@example.com",
    contact_address: "456 Patel Street, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    location_coordinates: { lat: 23.1828, lng: 75.7764 },
    status: "active",
  },
  {
    id: "lost_person_001",
    userId: "user_seed_003",
    type: "lost",
    category: "person",
    name: "Elderly Man - Ram Prasad",
    description:
      "My 75-year-old father Ram Prasad went missing during the evening aarti. He is wearing white kurta and has a walking stick. Please help us find him.",
    location: "Near Ram Ghat, Ujjain",
    contact_name: "Amit Kumar",
    contact_phone: "+919876543212",
    contact_email: "amit.kumar@example.com",
    contact_address: "789 Kumar Villa, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    location_coordinates: { lat: 23.175, lng: 75.79 },
    status: "pending",
  },
  {
    id: "found_pet_001",
    userId: "user_seed_004",
    type: "found",
    category: "pet",
    name: "Golden Retriever Dog",
    description:
      "Found a friendly golden retriever near the parking area. The dog is well-groomed and appears to be lost. Please contact if this is your pet.",
    location: "Parking Area, Simhastha Mela Ground",
    contact_name: "Sneha Desai",
    contact_phone: "+919876543213",
    contact_email: "sneha.desai@example.com",
    contact_address: "321 Desai Lane, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
    location_coordinates: { lat: 23.18, lng: 75.785 },
    status: "active",
  },
  {
    id: "lost_item_002",
    userId: "user_seed_001",
    type: "lost",
    category: "document",
    name: "Passport - Rajesh Kumar",
    description:
      "Lost my passport during the mela. It belongs to Rajesh Kumar. Very urgent as I need to travel next week. Reward offered for return.",
    location: "Food Court Area, Simhastha Mela",
    contact_name: "Rahul Sharma",
    contact_phone: "+919876543210",
    contact_email: "rahul.sharma@example.com",
    contact_address: "123 Gandhi Road, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    location_coordinates: { lat: 23.177, lng: 75.787 },
    status: "pending",
  },
  {
    id: "found_item_002",
    userId: "user_seed_002",
    type: "found",
    category: "item",
    name: "Samsung Galaxy Watch",
    description:
      "Found a Samsung Galaxy Watch near the medical tent. The watch is in good condition and appears to be recently lost.",
    location: "Medical Tent Area, Simhastha Mela",
    contact_name: "Priya Patel",
    contact_phone: "+919876543211",
    contact_email: "priya.patel@example.com",
    contact_address: "456 Patel Street, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    location_coordinates: { lat: 23.178, lng: 75.786 },
    status: "active",
  },
  {
    id: "lost_item_003",
    userId: "user_seed_003",
    type: "lost",
    category: "item",
    name: "Wallet with Cash",
    description:
      "Lost my wallet containing cash and important documents. It is a brown leather wallet. Please return if found.",
    location: "Boat Ghat Area, Ujjain",
    contact_name: "Amit Kumar",
    contact_phone: "+919876543212",
    contact_email: "amit.kumar@example.com",
    contact_address: "789 Kumar Villa, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    location_coordinates: { lat: 23.174, lng: 75.789 },
    status: "pending",
  },
  {
    id: "found_person_001",
    userId: "user_seed_004",
    type: "found",
    category: "person",
    name: "Lost Child - Kavya (Age 5)",
    description:
      "Found a lost child named Kavya, approximately 5 years old. She is wearing a pink dress and is looking for her parents. Please contact if you know her family.",
    location: "Children's Play Area, Simhastha Mela",
    contact_name: "Sneha Desai",
    contact_phone: "+919876543213",
    contact_email: "sneha.desai@example.com",
    contact_address: "321 Desai Lane, Ujjain",
    image_url:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400",
    location_coordinates: { lat: 23.179, lng: 75.784 },
    status: "active",
  },
];

async function seedLostFound() {
  console.log("🌱 Starting Lost & Found seed process...");

  try {
    // Clear existing seed data
    console.log("🧹 Cleaning up existing seed data...");
    await prisma.lostFoundItem.deleteMany({
      where: {
        id: {
          startsWith: "lost_item_",
        },
      },
    });
    await prisma.lostFoundItem.deleteMany({
      where: {
        id: {
          startsWith: "found_item_",
        },
      },
    });
    await prisma.lostFoundItem.deleteMany({
      where: {
        id: {
          startsWith: "lost_person_",
        },
      },
    });
    await prisma.lostFoundItem.deleteMany({
      where: {
        id: {
          startsWith: "found_person_",
        },
      },
    });
    await prisma.lostFoundItem.deleteMany({
      where: {
        id: {
          startsWith: "found_pet_",
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          startsWith: "user_seed_",
        },
      },
    });

    console.log("✅ Cleanup completed");

    // Create or update sample users
    console.log("👥 Creating/updating sample users...");
    for (const user of sampleUsers) {
      await prisma.user.upsert({
        where: { phone_number: user.phone_number },
        update: {
          name: user.name,
          language_preference: user.language_preference,
          totalPunyaPoints: user.totalPunyaPoints,
          aadhaarNumber: user.aadhaarNumber,
          isAadhaarVerified: user.isAadhaarVerified,
        },
        create: user,
      });
      console.log(`   ✅ Upserted user: ${user.name}`);
    }

    // Create or update sample lost & found items
    console.log("📦 Creating/updating sample lost & found items...");
    for (const item of sampleLostFoundItems) {
      await prisma.lostFoundItem.upsert({
        where: { id: item.id },
        update: {
          type: item.type,
          category: item.category,
          name: item.name,
          description: item.description,
          location: item.location,
          contact_name: item.contact_name,
          contact_phone: item.contact_phone,
          contact_email: item.contact_email,
          contact_address: item.contact_address,
          image_url: item.image_url,
          location_coordinates: item.location_coordinates,
          status: item.status,
        },
        create: item,
      });
      console.log(`   ✅ Upserted ${item.type} item: ${item.name}`);
    }

    console.log("🎉 Lost & Found seed data created successfully!");
    console.log("\n📊 Summary:");
    console.log(`   👥 Users created: ${sampleUsers.length}`);
    console.log(`   📦 Items created: ${sampleLostFoundItems.length}`);
    console.log("\n🔍 Sample data includes:");
    console.log("   • Lost items (iPhone, Passport, Wallet)");
    console.log("   • Found items (Gold Necklace, Samsung Watch)");
    console.log("   • Lost person (Elderly man)");
    console.log("   • Found person (Lost child)");
    console.log("   • Found pet (Golden Retriever)");
  } catch (error) {
    console.error("❌ Error seeding lost & found data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedLostFound()
  .then(() => {
    console.log("\n✅ Seed process completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed process failed:", error);
    process.exit(1);
  });
