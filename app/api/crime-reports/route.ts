import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Alternative Prisma client for debugging
const directPrisma = new PrismaClient();

// GET - Fetch crime reports
export async function GET(req: NextRequest) {
  console.log("🔥 API GET /api/crime-reports called");
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const crime_type = searchParams.get("crime_type");
    const severity = searchParams.get("severity");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { status: { not: "closed" } };

    if (crime_type && crime_type !== "all") {
      where.crime_type = crime_type;
    }

    if (severity && severity !== "all") {
      where.severity = severity;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch items with user info
    const prismaClient = prisma.lostFoundItem ? prisma : directPrisma;
    const reports = await prismaClient.crimeReport.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            totalPunyaPoints: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prismaClient.crimeReport.count({ where });

    return NextResponse.json({
      success: true,
      reports,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching crime reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// POST - Create a new crime report
export async function POST(req: NextRequest) {
  console.log("🔥 API POST /api/crime-reports called");
  console.log("🔗 Request URL:", req.url);
  console.log("🔗 Request method:", req.method);
  try {
    const { userId } = await auth();
    console.log("👤 User ID from auth:", userId);

    const requestBody = await req.json();
    console.log("📨 Request body received:", requestBody);

    const {
      crime_type,
      severity,
      description,
      location,
      incident_date,
      contactName,
      contactPhone,
      contactEmail,
      contactAddress,
      imageUrl,
      is_anonymous,
      locationData,
      locationCoordinates,
    } = requestBody;

    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated, validating fields...");
    console.log("🔍 Field validation:", {
      crime_type: !!crime_type,
      severity: !!severity,
      description: !!description,
      location: !!location,
      contactName: !!contactName,
      contactPhone: !!contactPhone,
    });

    if (
      !crime_type ||
      !severity ||
      !description ||
      !location ||
      !contactName ||
      !contactPhone
    ) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure app user exists
    console.log("🔍 Getting current user from Clerk...");
    const clerk = await currentUser();
    console.log("👤 Clerk user data:", {
      id: clerk?.id,
      fullName: clerk?.fullName,
      username: clerk?.username,
      email: clerk?.primaryEmailAddress?.emailAddress,
      phone: clerk?.phoneNumbers?.[0]?.phoneNumber,
    });

    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;

    console.log("🔑 Identity key:", identityKey);

    console.log("👥 Upserting app user...");
    const appUser = await (prisma.user ? prisma : directPrisma).user.upsert({
      where: { phone_number: identityKey },
      update: {},
      create: {
        phone_number: identityKey,
        name: clerk?.fullName || clerk?.username || undefined,
        language_preference: "English",
        totalPunyaPoints: 0,
      },
    });
    console.log("✅ App user created/found:", appUser);

    // Debug Prisma client
    console.log("🔍 Prisma client debug:", {
      prismaExists: !!prisma,
      crimeReportExists: !!prisma.crimeReport,
      prismaKeys: Object.keys(prisma),
    });

    console.log("🔍 Direct Prisma client debug:", {
      directPrismaExists: !!directPrisma,
      directCrimeReportExists: !!directPrisma.crimeReport,
      directPrismaKeys: Object.keys(directPrisma),
    });

    // Create the crime report
    console.log("📝 Creating crime report with data:", {
      userId: appUser.id,
      crime_type,
      severity,
      description: description.trim(),
      location: location.trim(),
      incident_date: incident_date ? new Date(incident_date) : null,
      contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(),
      contact_email: contactEmail?.trim() || null,
      contact_address: contactAddress?.trim() || null,
      image_url: imageUrl || null,
      is_anonymous: is_anonymous || false,
      location_coordinates: locationCoordinates || null,
    });

    // Try using the direct Prisma client if the main one fails
    const prismaClient = prisma.crimeReport ? prisma : directPrisma;
    console.log(
      "🔧 Using Prisma client:",
      prismaClient === prisma ? "main" : "direct"
    );

    const report = await prismaClient.crimeReport.create({
      data: {
        userId: appUser.id,
        crime_type,
        severity,
        description: description.trim(),
        location: location.trim(),
        incident_date: incident_date ? new Date(incident_date) : null,
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        contact_email: contactEmail?.trim() || null,
        contact_address: contactAddress?.trim() || null,
        image_url: imageUrl || null,
        is_anonymous: is_anonymous || false,
        location_coordinates: locationCoordinates || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            totalPunyaPoints: true,
          },
        },
      },
    });
    console.log("✅ Crime report created:", report);

    // Award points for reporting a crime (encouraging community safety)
    const CRIME_REPORT_POINTS = 15;
    console.log(
      `🏆 Awarding ${CRIME_REPORT_POINTS} points to user ${appUser.id}`
    );
    await prismaClient.user.update({
      where: { id: appUser.id },
      data: {
        totalPunyaPoints: {
          increment: CRIME_REPORT_POINTS,
        },
      },
    });
    console.log("✅ Points awarded successfully");

    const response = {
      success: true,
      report,
      pointsAwarded: CRIME_REPORT_POINTS,
    };
    console.log("🎉 Sending success response:", response);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("💥 Error creating crime report:", error);
    console.error("💥 Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
