import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Alternative Prisma client for debugging
const directPrisma = new PrismaClient();

// GET - Fetch lost and found items
export async function GET(req: NextRequest) {
  console.log("🔥 API GET /api/lost-found called");
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type"); // 'lost' or 'found'
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { status: "active" };

    if (type && type !== "all") {
      where.type = type;
    }

    if (category && category !== "all") {
      where.category = category;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch items with user info
    const prismaClient = prisma.lostFoundItem ? prisma : directPrisma;
    const items = await prismaClient.lostFoundItem.findMany({
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
    const totalCount = await prismaClient.lostFoundItem.count({ where });

    return NextResponse.json({
      success: true,
      items,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching lost and found items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST - Create a new lost and found item
export async function POST(req: NextRequest) {
  console.log("🔥 API POST /api/lost-found called");
  console.log("🔗 Request URL:", req.url);
  console.log("🔗 Request method:", req.method);
  try {
    const { userId } = await auth();
    console.log("👤 User ID from auth:", userId);

    const requestBody = await req.json();
    console.log("📨 Request body received:", requestBody);

    const {
      type,
      category,
      name,
      description,
      location,
      contactName,
      contactPhone,
      contactEmail,
      contactAddress,
      imageUrl,
      locationData,
      locationCoordinates,
    } = requestBody;

    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ User authenticated, validating fields...");
    console.log("🔍 Field validation:", {
      type: !!type,
      category: !!category,
      name: !!name,
      description: !!description,
      location: !!location,
      contactName: !!contactName,
      contactPhone: !!contactPhone,
    });

    if (
      !type ||
      !category ||
      !name ||
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
      lostFoundItemExists: !!prisma.lostFoundItem,
      prismaKeys: Object.keys(prisma),
    });
    
    console.log("🔍 Direct Prisma client debug:", {
      directPrismaExists: !!directPrisma,
      directLostFoundItemExists: !!directPrisma.lostFoundItem,
      directPrismaKeys: Object.keys(directPrisma),
    });

    // Create the lost/found item
    console.log("📝 Creating lost/found item with data:", {
      userId: appUser.id,
      type,
      category,
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(),
      contact_email: contactEmail?.trim() || null,
      contact_address: contactAddress?.trim() || null,
      image_url: imageUrl || null,
      location_coordinates: locationCoordinates || null,
    });

    // Try using the direct Prisma client if the main one fails
    const prismaClient = prisma.lostFoundItem ? prisma : directPrisma;
    console.log("🔧 Using Prisma client:", prismaClient === prisma ? "main" : "direct");
    
    const item = await prismaClient.lostFoundItem.create({
      data: {
        userId: appUser.id,
        type,
        category,
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        contact_email: contactEmail?.trim() || null,
        contact_address: contactAddress?.trim() || null,
        image_url: imageUrl || null,
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
   

    // Award points for posting a lost/found item
    const LOST_FOUND_POINTS = 10;
    
    await prismaClient.user.update({
      where: { id: appUser.id },
      data: {
        totalPunyaPoints: {
          increment: LOST_FOUND_POINTS,
        },
      },
    });
    console.log("✅ Points awarded successfully");

    const response = {
      success: true,
      item,
      pointsAwarded: LOST_FOUND_POINTS,
    };
   
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("💥 Error creating lost/found item:", error);
    console.error("💥 Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
