import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

// Ujjain coordinates and locations
const UJJAIN_LOCATIONS = {
  // Major temples and religious sites
  mahakal_temple: {
    name: "Mahakaleshwar Temple",
    address: "Mahakal Temple Road, Ujjain",
    coordinates: { lat: 23.1828, lng: 75.7772 },
  },
  harsiddhi_temple: {
    name: "Harsiddhi Temple",
    address: "Harsiddhi Temple Road, Ujjain",
    coordinates: { lat: 23.1833, lng: 75.7767 },
  },
  bade_ganeshji: {
    name: "Bade Ganeshji Temple",
    address: "Bade Ganeshji Road, Ujjain",
    coordinates: { lat: 23.1842, lng: 75.7778 },
  },
  kal_bhairav: {
    name: "Kal Bhairav Temple",
    address: "Kal Bhairav Road, Ujjain",
    coordinates: { lat: 23.185, lng: 75.7785 },
  },
  ram_ghat: {
    name: "Ram Ghat",
    address: "Ram Ghat Road, Ujjain",
    coordinates: { lat: 23.18, lng: 75.775 },
  },

  // Transportation hubs
  railway_station: {
    name: "Ujjain Junction Railway Station",
    address: "Station Road, Ujjain",
    coordinates: { lat: 23.175, lng: 75.77 },
  },
  bus_stand: {
    name: "Ujjain Bus Stand",
    address: "Bus Stand Road, Ujjain",
    coordinates: { lat: 23.17, lng: 75.765 },
  },

  // Markets and commercial areas
  freeganj_market: {
    name: "Freeganj Market",
    address: "Freeganj, Ujjain",
    coordinates: { lat: 23.188, lng: 75.78 },
  },
  tower_square: {
    name: "Tower Square",
    address: "Tower Square, Ujjain",
    coordinates: { lat: 23.19, lng: 75.782 },
  },

  // Educational and cultural sites
  sandipani_ashram: {
    name: "Sandipani Ashram",
    address: "Sandipani Ashram Road, Ujjain",
    coordinates: { lat: 23.195, lng: 75.785 },
  },
  vedh_shala: {
    name: "Vedh Shala (Observatory)",
    address: "Vedh Shala Road, Ujjain",
    coordinates: { lat: 23.2, lng: 75.79 },
  },

  // Residential areas
  vikram_nagar: {
    name: "Vikram Nagar",
    address: "Vikram Nagar, Ujjain",
    coordinates: { lat: 23.16, lng: 75.76 },
  },
  madhav_nagar: {
    name: "Madhav Nagar",
    address: "Madhav Nagar, Ujjain",
    coordinates: { lat: 23.165, lng: 75.765 },
  },
};

async function seedUjjainData() {
  console.log("🌱 Seeding Ujjain crime reports and lost-found data...");

  // Get existing users or create demo users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { phone_number: "ujjain1@yaat.com" },
      update: {},
      create: {
        phone_number: "ujjain1@yaat.com",
        name: "Priya Sharma",
        language_preference: "Hindi",
        totalPunyaPoints: 150,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "ujjain2@yaat.com" },
      update: {},
      create: {
        phone_number: "ujjain2@yaat.com",
        name: "Rajesh Kumar",
        language_preference: "English",
        totalPunyaPoints: 200,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "ujjain3@yaat.com" },
      update: {},
      create: {
        phone_number: "ujjain3@yaat.com",
        name: "Sunita Patel",
        language_preference: "Gujarati",
        totalPunyaPoints: 175,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "ujjain4@yaat.com" },
      update: {},
      create: {
        phone_number: "ujjain4@yaat.com",
        name: "Amit Jain",
        language_preference: "Hindi",
        totalPunyaPoints: 120,
      },
    }),
    prisma.user.upsert({
      where: { phone_number: "ujjain5@yaat.com" },
      update: {},
      create: {
        phone_number: "ujjain5@yaat.com",
        name: "Kavya Singh",
        language_preference: "English",
        totalPunyaPoints: 180,
      },
    }),
  ]);

  // Create crime reports
  const crimeReports = [
    {
      crime_type: "theft",
      severity: "medium",
      description:
        "Mobile phone stolen from pocket while performing aarti at Mahakal Temple. Suspect was a young man in white shirt who was standing very close during the crowd.",
      location: UJJAIN_LOCATIONS.mahakal_temple.address,
      location_coordinates: UJJAIN_LOCATIONS.mahakal_temple.coordinates,
      incident_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      contact_name: "Priya Sharma",
      contact_phone: "+91 9876543210",
      contact_email: "priya@example.com",
      contact_address: "123 Temple Road, Ujjain",
      userId: users[0].id,
      status: "reported",
    },
    {
      crime_type: "vandalism",
      severity: "low",
      description:
        "Graffiti found on the walls of Harsiddhi Temple. Someone has written inappropriate messages on the temple walls. This is disrespectful to the sacred place.",
      location: UJJAIN_LOCATIONS.harsiddhi_temple.address,
      location_coordinates: UJJAIN_LOCATIONS.harsiddhi_temple.coordinates,
      incident_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      contact_name: "Rajesh Kumar",
      contact_phone: "+91 9876543211",
      contact_email: "rajesh@example.com",
      contact_address: "456 Ghat Road, Ujjain",
      userId: users[1].id,
      status: "investigating",
    },
    {
      crime_type: "theft",
      severity: "high",
      description:
        "Gold chain snatched from neck near Ram Ghat. Two men on a motorcycle approached from behind and snatched the chain. The victim is an elderly woman who was visiting for pilgrimage.",
      location: UJJAIN_LOCATIONS.ram_ghat.address,
      location_coordinates: UJJAIN_LOCATIONS.ram_ghat.coordinates,
      incident_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      contact_name: "Sunita Patel",
      contact_phone: "+91 9876543212",
      contact_email: "sunita@example.com",
      contact_address: "789 Temple Street, Ujjain",
      userId: users[2].id,
      status: "reported",
    },
    {
      crime_type: "fraud",
      severity: "medium",
      description:
        "Fake priest demanding money for special puja at Bade Ganeshji Temple. The person was not an authorized priest and was asking for large amounts of money for fake rituals.",
      location: UJJAIN_LOCATIONS.bade_ganeshji.address,
      location_coordinates: UJJAIN_LOCATIONS.bade_ganeshji.coordinates,
      incident_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      contact_name: "Amit Jain",
      contact_phone: "+91 9876543213",
      contact_email: "amit@example.com",
      contact_address: "321 Market Street, Ujjain",
      userId: users[3].id,
      status: "reported",
    },
    {
      crime_type: "theft",
      severity: "low",
      description:
        "Wallet pickpocketed at Freeganj Market. The wallet contained cash and important documents. The incident happened during peak shopping hours when the market was crowded.",
      location: UJJAIN_LOCATIONS.freeganj_market.address,
      location_coordinates: UJJAIN_LOCATIONS.freeganj_market.coordinates,
      incident_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      contact_name: "Kavya Singh",
      contact_phone: "+91 9876543214",
      contact_email: "kavya@example.com",
      contact_address: "654 Ashram Road, Ujjain",
      userId: users[4].id,
      status: "resolved",
    },
    {
      crime_type: "vandalism",
      severity: "medium",
      description:
        "Temple property damaged at Kal Bhairav Temple. Some decorative items were broken and the donation box was tampered with. This happened during night time.",
      location: UJJAIN_LOCATIONS.kal_bhairav.address,
      location_coordinates: UJJAIN_LOCATIONS.kal_bhairav.coordinates,
      incident_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      contact_name: "Priya Sharma",
      contact_phone: "+91 9876543210",
      contact_email: "priya@example.com",
      contact_address: "123 Temple Road, Ujjain",
      userId: users[0].id,
      status: "investigating",
    },
    {
      crime_type: "other",
      severity: "low",
      description:
        "Unauthorized vendors selling fake prasad near railway station. These vendors are not authorized by the temple trust and are selling low-quality items to tourists.",
      location: UJJAIN_LOCATIONS.railway_station.address,
      location_coordinates: UJJAIN_LOCATIONS.railway_station.coordinates,
      incident_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      contact_name: "Rajesh Kumar",
      contact_phone: "+91 9876543211",
      contact_email: "rajesh@example.com",
      contact_address: "456 Ghat Road, Ujjain",
      userId: users[1].id,
      status: "reported",
    },
  ];

  // Create lost and found items
  const lostFoundItems = [
    {
      type: "lost",
      category: "item",
      name: "Gold Chain with Om Pendant",
      description:
        "Lost my gold chain with Om pendant near Mahakal Temple. It's a family heirloom with sentimental value. The chain is 22k gold and the pendant has intricate Om design. Please help me find it.",
      location: UJJAIN_LOCATIONS.mahakal_temple.address,
      location_coordinates: UJJAIN_LOCATIONS.mahakal_temple.coordinates,
      contact_name: "Priya Sharma",
      contact_phone: "+91 9876543210",
      contact_email: "priya@example.com",
      contact_address: "123 Temple Road, Ujjain",
      userId: users[0].id,
      status: "active",
    },
    {
      type: "found",
      category: "document",
      name: "Aadhaar Card Found",
      description:
        "Found an Aadhaar card near the ghats. Name: Rajesh Kumar, DOB: 15/03/1990. Please contact me if this belongs to you or someone you know.",
      location: UJJAIN_LOCATIONS.ram_ghat.address,
      location_coordinates: UJJAIN_LOCATIONS.ram_ghat.coordinates,
      contact_name: "Sunita Patel",
      contact_phone: "+91 9876543212",
      contact_email: "sunita@example.com",
      contact_address: "789 Temple Street, Ujjain",
      userId: users[2].id,
      status: "active",
    },
    {
      type: "lost",
      category: "pet",
      name: "Missing Golden Retriever - Max",
      description:
        "Lost my 3-year-old Golden Retriever named Max. He's very friendly and responds to his name. Last seen near Harsiddhi Temple. He has a blue collar with contact details. Please help us find him.",
      location: UJJAIN_LOCATIONS.harsiddhi_temple.address,
      location_coordinates: UJJAIN_LOCATIONS.harsiddhi_temple.coordinates,
      contact_name: "Rajesh Kumar",
      contact_phone: "+91 9876543211",
      contact_email: "rajesh@example.com",
      contact_address: "456 Ghat Road, Ujjain",
      userId: users[1].id,
      status: "active",
    },
    {
      type: "found",
      category: "item",
      name: "Mobile Phone Found",
      description:
        "Found a Samsung Galaxy phone near the bus stand. The phone is locked but I can see it has a blue case. Please contact me with the phone details to claim it.",
      location: UJJAIN_LOCATIONS.bus_stand.address,
      location_coordinates: UJJAIN_LOCATIONS.bus_stand.coordinates,
      contact_name: "Priya Sharma",
      contact_phone: "+91 9876543210",
      contact_email: "priya@example.com",
      contact_address: "123 Temple Road, Ujjain",
      userId: users[0].id,
      status: "active",
    },
    {
      type: "lost",
      category: "person",
      name: "Missing Elderly Person - Ramesh Ji",
      description:
        "My father Ramesh (75 years old) went missing from the temple area. He was wearing a white kurta and has difficulty walking. He might be confused about directions. Please help us find him.",
      location: UJJAIN_LOCATIONS.mahakal_temple.address,
      location_coordinates: UJJAIN_LOCATIONS.mahakal_temple.coordinates,
      contact_name: "Sunita Patel",
      contact_phone: "+91 9876543212",
      contact_email: "sunita@example.com",
      contact_address: "789 Temple Street, Ujjain",
      userId: users[2].id,
      status: "active",
    },
    {
      type: "found",
      category: "item",
      name: "Wallet Found with Cash",
      description:
        "Found a brown leather wallet near the railway station. Contains cash, some cards, and ID. The owner can identify by describing the contents. Please contact me to claim.",
      location: UJJAIN_LOCATIONS.railway_station.address,
      location_coordinates: UJJAIN_LOCATIONS.railway_station.coordinates,
      contact_name: "Rajesh Kumar",
      contact_phone: "+91 9876543211",
      contact_email: "rajesh@example.com",
      contact_address: "456 Ghat Road, Ujjain",
      userId: users[1].id,
      status: "active",
    },
    {
      type: "lost",
      category: "item",
      name: "Silver Anklets Lost",
      description:
        "Lost my silver anklets while taking a dip in the holy waters at Ram Ghat. They have small bells and are very dear to me. Please help me find them.",
      location: UJJAIN_LOCATIONS.ram_ghat.address,
      location_coordinates: UJJAIN_LOCATIONS.ram_ghat.coordinates,
      contact_name: "Kavya Singh",
      contact_phone: "+91 9876543214",
      contact_email: "kavya@example.com",
      contact_address: "654 Ashram Road, Ujjain",
      userId: users[4].id,
      status: "active",
    },
    {
      type: "found",
      category: "document",
      name: "Passport Found",
      description:
        "Found a passport near Tower Square. The passport belongs to a foreign tourist. Please contact me if you know the owner or if this is yours.",
      location: UJJAIN_LOCATIONS.tower_square.address,
      location_coordinates: UJJAIN_LOCATIONS.tower_square.coordinates,
      contact_name: "Amit Jain",
      contact_phone: "+91 9876543213",
      contact_email: "amit@example.com",
      contact_address: "321 Market Street, Ujjain",
      userId: users[3].id,
      status: "active",
    },
    {
      type: "lost",
      category: "item",
      name: "Temple Prasad Box Lost",
      description:
        "Lost a small wooden box containing temple prasad from Mahakal Temple. The box has intricate carvings and contains sacred items. It's very important for my family.",
      location: UJJAIN_LOCATIONS.mahakal_temple.address,
      location_coordinates: UJJAIN_LOCATIONS.mahakal_temple.coordinates,
      contact_name: "Sunita Patel",
      contact_phone: "+91 9876543212",
      contact_email: "sunita@example.com",
      contact_address: "789 Temple Street, Ujjain",
      userId: users[2].id,
      status: "active",
    },
    {
      type: "found",
      category: "item",
      name: "Religious Books Found",
      description:
        "Found a bundle of religious books near Sandipani Ashram. The books appear to be in Sanskrit and Hindi. Please contact me to claim them.",
      location: UJJAIN_LOCATIONS.sandipani_ashram.address,
      location_coordinates: UJJAIN_LOCATIONS.sandipani_ashram.coordinates,
      contact_name: "Priya Sharma",
      contact_phone: "+91 9876543210",
      contact_email: "priya@example.com",
      contact_address: "123 Temple Road, Ujjain",
      userId: users[0].id,
      status: "active",
    },
  ];

  // Create crime reports
  console.log("📊 Creating crime reports...");
  for (const reportData of crimeReports) {
    await prisma.crimeReport.create({
      data: reportData,
    });
  }

  // Create lost and found items
  console.log("📊 Creating lost and found items...");
  for (const itemData of lostFoundItems) {
    await prisma.lostFoundItem.create({
      data: itemData,
    });
  }

  console.log("✅ Ujjain data seeded successfully!");
  console.log(`📊 Created ${crimeReports.length} crime reports`);
  console.log(`📊 Created ${lostFoundItems.length} lost and found items`);
  console.log("🗺️ All items include precise coordinates for map testing");
}

seedUjjainData()
  .catch((e) => {
    console.error("❌ Error seeding Ujjain data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
