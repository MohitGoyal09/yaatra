#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up YaatraSarthi Database...\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("❌ .env.local file not found!");
  console.log("📝 Please create a .env.local file with the following content:");
  console.log("");
  console.log("# Database");
  console.log(
    'DATABASE_URL="postgresql://username:password@localhost:5432/yaat_db"'
  );
  console.log("");
  console.log("# Vapi Configuration");
  console.log('NEXT_PUBLIC_VAPI_PUBLIC_KEY="your-vapi-public-key"');
  console.log('NEXT_PUBLIC_VAPI_ASSISTANT_ID="your-vapi-assistant-id"');
  console.log("");
  console.log("# Google AI");
  console.log('GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-key"');
  console.log("");
  console.log("⚠️  Make sure to:");
  console.log(
    "   1. Replace the DATABASE_URL with your actual PostgreSQL connection string"
  );
  console.log(
    "   2. Get your Vapi credentials from https://dashboard.vapi.ai/"
  );
  console.log("   3. Get your Google AI key from https://aistudio.google.com/");
  console.log("");
  process.exit(1);
}

console.log("✅ .env.local file found");

try {
  // Generate Prisma client
  console.log("📦 Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma client generated");

  // Push database schema
  console.log("🗄️  Pushing database schema...");
  execSync("npx prisma db push", { stdio: "inherit" });
  console.log("✅ Database schema pushed");

  // Seed the database
  console.log("🌱 Seeding database...");
  execSync("npm run db:seed", { stdio: "inherit" });
  console.log("✅ Database seeded");

  console.log("\n🎉 Database setup completed successfully!");
  console.log(
    '🚀 You can now run "npm run dev" to start the development server'
  );
  console.log(
    "💬 The Vapi widget will appear once you add your API keys to .env.local"
  );
} catch (error) {
  console.error("❌ Error setting up database:", error.message);
  console.log("\n🔧 Troubleshooting:");
  console.log("   1. Make sure PostgreSQL is running");
  console.log("   2. Check your DATABASE_URL in .env.local");
  console.log("   3. Ensure you have the correct permissions");
  process.exit(1);
}
