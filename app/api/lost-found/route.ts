import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET - Fetch lost and found items
export async function GET(req: NextRequest) {
  console.log("🔥 API GET /api/lost-found called");

  // Ensure we always return JSON
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error("❌ Prisma client not available");
      return NextResponse.json({
        success: true,
        items: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        mock: true,
      });
    }

    // Add timeout to prevent hanging connections
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database query timeout")), 10000);
    });

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

    // Fetch items with user info and total count with timeout
    const [items, totalCount] = (await Promise.race([
      Promise.all([
        prisma.lostFoundItem.findMany({
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
        }),
        prisma.lostFoundItem.count({ where }),
      ]),
      timeoutPromise,
    ])) as any;

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

    // Return mock data if database is not available or timeout occurs
    if (
      error instanceof Error &&
      (error.message.includes("timeout") ||
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("getaddrinfo"))
    ) {
      console.log("📦 Returning mock data due to database connection issue");
      return NextResponse.json({
        success: true,
        items: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
        mock: true,
      });
    }

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

  // Ensure we always return JSON
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error("❌ Prisma client not available");
      return NextResponse.json({
        success: true,
        item: {
          id: "mock-id",
          type: "lost",
          category: "electronics",
          name: "Mock Item",
          description: "This is a mock response",
          location: "Mock Location",
          status: "active",
          created_at: new Date().toISOString(),
          user: {
            id: "mock-user",
            name: "Mock User",
            totalPunyaPoints: 0,
          },
        },
        pointsAwarded: 10,
        mock: true,
      });
    }

    // Add timeout to prevent hanging connections
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database query timeout")), 15000);
    });

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

    // Enhanced input validation
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

    // Validate field lengths and formats
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Item name too long (max 100 characters)" },
        { status: 400 }
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: "Description too long (max 500 characters)" },
        { status: 400 }
      );
    }

    if (location.length > 200) {
      return NextResponse.json(
        { error: "Location too long (max 200 characters)" },
        { status: 400 }
      );
    }

    if (contactName.length > 50) {
      return NextResponse.json(
        { error: "Contact name too long (max 50 characters)" },
        { status: 400 }
      );
    }

    if (contactPhone.length > 20) {
      return NextResponse.json(
        { error: "Contact phone too long (max 20 characters)" },
        { status: 400 }
      );
    }

    // Validate type and category
    const validTypes = ["lost", "found"];
    const validCategories = [
      "electronics",
      "documents",
      "clothing",
      "jewelry",
      "other",
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'lost' or 'found'" },
        { status: 400 }
      );
    }

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
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
    const appUser = (await Promise.race([
      prisma.user.upsert({
        where: { phone_number: identityKey },
        update: {},
        create: {
          phone_number: identityKey,
          name: clerk?.fullName || clerk?.username || undefined,
          language_preference: "English",
          totalPunyaPoints: 0,
        },
      }),
      timeoutPromise,
    ])) as any;
    console.log("✅ App user created/found:", appUser);

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

    // Create item and update points with timeout
    const LOST_FOUND_POINTS = 10;

    const [item] = (await Promise.race([
      Promise.all([
        prisma.lostFoundItem.create({
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
        }),
        prisma.user.update({
          where: { id: appUser.id },
          data: {
            totalPunyaPoints: {
              increment: LOST_FOUND_POINTS,
            },
          },
        }),
      ]),
      timeoutPromise,
    ])) as any;

    console.log("✅ Item created and points awarded successfully");

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

    // Return mock response if database is not available or timeout occurs
    if (
      error instanceof Error &&
      (error.message.includes("timeout") ||
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("getaddrinfo") ||
        error.message.includes("P1001") || // Prisma connection error
        error.message.includes("P2002")) // Prisma unique constraint error
    ) {
      console.log("📦 Database not available, returning mock response");
      return NextResponse.json({
        success: true,
        item: {
          id: "mock-id",
          type: "lost",
          category: "electronics",
          name: "Mock Item",
          description: "This is a mock response",
          location: "Mock Location",
          status: "active",
          created_at: new Date().toISOString(),
          user: {
            id: "mock-user",
            name: "Mock User",
            totalPunyaPoints: 0,
          },
        },
        pointsAwarded: 10,
        mock: true,
      });
    }

    // Handle specific validation errors
    if (
      error.message.includes("validation") ||
      error.message.includes("constraint")
    ) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
