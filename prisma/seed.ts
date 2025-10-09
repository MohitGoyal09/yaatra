import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with Ujjain tourist actions...");

  // Create actions for Ujjain tourist activities
  const actions = [
    // Temple visits (highest points for most sacred)
    { action_name: "visit_mahakaleshwar_temple", point_value: 100 },
    { action_name: "visit_bade_ganeshji_temple", point_value: 80 },
    { action_name: "visit_harsiddhi_temple", point_value: 70 },
    { action_name: "visit_kal_bhairav_temple", point_value: 60 },
    { action_name: "visit_ram_ghat", point_value: 50 },
    { action_name: "visit_sandipani_ashram", point_value: 40 },
    { action_name: "visit_vedh_shala", point_value: 30 },
    { action_name: "visit_other_temple", point_value: 25 },

    // Rituals and spiritual activities
    { action_name: "perform_abhishek", point_value: 50 },
    { action_name: "perform_aarti", point_value: 40 },
    { action_name: "perform_puja", point_value: 35 },
    { action_name: "take_darshan", point_value: 30 },
    { action_name: "offer_prasad", point_value: 25 },
    { action_name: "light_diya", point_value: 20 },
    { action_name: "chant_mantra", point_value: 15 },

    // Photography and documentation
    { action_name: "take_temple_photo", point_value: 20 },
    { action_name: "take_ritual_photo", point_value: 25 },
    { action_name: "take_landmark_photo", point_value: 15 },
    { action_name: "record_video", point_value: 30 },

    // Learning and cultural activities
    { action_name: "learn_ujjain_history", point_value: 30 },
    { action_name: "learn_temple_significance", point_value: 25 },
    { action_name: "learn_ritual_meaning", point_value: 20 },
    { action_name: "attend_cultural_program", point_value: 35 },
    { action_name: "meet_sadhu_sant", point_value: 40 },

    // Special events and festivals
    { action_name: "attend_mahashivratri", point_value: 100 },
    { action_name: "attend_kumbh_mela", point_value: 150 },
    { action_name: "attend_other_festival", point_value: 50 },

    // Community and service
    { action_name: "help_pilgrim", point_value: 30 },
    { action_name: "donate_to_temple", point_value: 40 },
    { action_name: "volunteer_service", point_value: 50 },

    // Exploration and discovery
    { action_name: "explore_old_city", point_value: 25 },
    { action_name: "try_local_food", point_value: 15 },
    { action_name: "visit_market", point_value: 10 },
    { action_name: "learn_local_language", point_value: 20 },

    // Special achievements
    { action_name: "complete_temple_circuit", point_value: 200 },
    { action_name: "visit_all_jyotirlingas", point_value: 500 },
    { action_name: "spend_full_day_temple", point_value: 75 },
    { action_name: "early_morning_darshan", point_value: 40 },

    // Hygiene & Health
    { action_name: "dispose_waste_qr", point_value: 20 },
    { action_name: "report_hygiene_issue_photo", point_value: 30 },
    { action_name: "verify_hygiene_issue_resolved", point_value: 50 },

    // Eco-Friendliness (Green Behavior)
    { action_name: "refill_water_station_qr", point_value: 25 },
    { action_name: "use_public_transport_or_erickshaw", point_value: 15 },

    // Cultural & Community Engagement
    { action_name: "attend_cultural_event_checkin", point_value: 10 },
    { action_name: "help_lost_pilgrim_sos", point_value: 40 },
    { action_name: "share_cultural_story_featured", point_value: 15 },

    // User Verification
    { action_name: "aadhaar_verification", point_value: 100 },
  ];

  // Create actions in database
  for (const action of actions) {
    await prisma.action.upsert({
      where: { action_name: action.action_name },
      update: { point_value: action.point_value },
      create: action,
    });
  }

  console.log(`✅ Created ${actions.length} tourist actions`);

  // Create a sample user for testing
  const sampleUser = await prisma.user.upsert({
    where: { phone_number: "+919876543210" },
    update: {},
    create: {
      phone_number: "+919876543210",
      name: "Sample Tourist",
      language_preference: "English",
      totalPunyaPoints: 0,
    },
  });

  console.log("✅ Created sample user:", sampleUser.name);

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
