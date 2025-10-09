import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Constants
const LOST_FOUND_POINTS = 10;
const MAX_ITEMS_PER_PAGE = 100;
const DEFAULT_ITEMS_PER_PAGE = 20;

// Validation schemas
const VALID_TYPES = ["lost", "found"] as const;
const VALID_CATEGORIES = [
  "person",
  "pet",
  "item",
  "document",
  "other",
] as const;
const VALID_STATUSES = ["pending", "active", "resolved", "closed"] as const;

// Helper function to validate input data
function validateLostFoundData(data: any) {
  const errors: string[] = [];

  // Required fields
  if (!data.type || !VALID_TYPES.includes(data.type)) {
    errors.push("Type must be either 'lost' or 'found'");
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category)) {
    errors.push("Category must be one of: person, pet, item, document, other");
  }

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 100
  ) {
    errors.push("Name must be between 2 and 100 characters");
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim().length < 10 ||
    data.description.trim().length > 1000
  ) {
    errors.push("Description must be between 10 and 1000 characters");
  }

  if (
    !data.location ||
    typeof data.location !== "string" ||
    data.location.trim().length < 3 ||
    data.location.trim().length > 200
  ) {
    errors.push("Location must be between 3 and 200 characters");
  }

  if (
    !data.contactName ||
    typeof data.contactName !== "string" ||
    data.contactName.trim().length < 2 ||
    data.contactName.trim().length > 50
  ) {
    errors.push("Contact name must be between 2 and 50 characters");
  }

  if (
    !data.contactPhone ||
    typeof data.contactPhone !== "string" ||
    data.contactPhone.trim().length < 10 ||
    data.contactPhone.trim().length > 20
  ) {
    errors.push("Contact phone must be between 10 and 20 characters");
  }

  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (data.contactPhone && !phoneRegex.test(data.contactPhone.trim())) {
    errors.push("Please enter a valid phone number");
  }

  // Email validation (optional)
  if (data.contactEmail && data.contactEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail.trim())) {
      errors.push("Please enter a valid email address");
    }
  }

  // Image URL validation (optional)
  if (data.imageUrl && data.imageUrl.trim()) {
    try {
      new URL(data.imageUrl.trim());
    } catch {
      errors.push("Please enter a valid image URL");
    }
  }

  return errors;
}

// Helper function to ensure user exists in database
async function ensureUserExists(userId: string, clerkUser: any) {
  console.log("👤 [DEBUG] Ensuring user exists:", userId);

  const identityKey =
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.phoneNumbers?.[0]?.phoneNumber ||
    userId;

  if (!identityKey) {
    throw new Error("Unable to determine user identity");
  }

  const user = await prisma.user.upsert({
    where: { phone_number: identityKey },
    update: {},
    create: {
      phone_number: identityKey,
      name: clerkUser?.fullName || clerkUser?.username || "Anonymous User",
      language_preference: "English",
      totalPunyaPoints: 0,
    },
  });

  console.log("✅ [DEBUG] User ensured:", user.id);
  return user;
}

// GET - Fetch lost and found items with filtering and pagination
export async function GET(req: NextRequest) {
  console.log("🔥 [DEBUG] GET /api/lost-found called");
  console.log("🌐 [DEBUG] Request URL:", req.url);

  try {
    // Check database connection
    if (!prisma) {
      console.error("❌ [DEBUG] Prisma client not available");
      return NextResponse.json(
        {
          success: false,
          error: "Database connection not available",
          message: "Please check your database configuration",
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(DEFAULT_ITEMS_PER_PAGE)),
      MAX_ITEMS_PER_PAGE
    );
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    console.log("🔍 [DEBUG] Query parameters:", {
      page,
      limit,
      type,
      category,
      location,
      search,
      skip,
    });

    // Build where clause
    const where: any = {
      status: {
        in: ["pending", "active"], // Only show pending and active items
      },
    };

    // Add type filter
    if (type && type !== "all" && VALID_TYPES.includes(type as any)) {
      where.type = type;
    }

    // Add category filter
    if (
      category &&
      category !== "all" &&
      VALID_CATEGORIES.includes(category as any)
    ) {
      where.category = category;
    }

    // Add location filter
    if (location && location.trim().length >= 3) {
      where.location = {
        contains: location.trim(),
        mode: "insensitive",
      };
    }

    // Add search filter
    if (search && search.trim().length >= 3) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
        { location: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    console.log("🔍 [DEBUG] Where clause:", JSON.stringify(where, null, 2));

    // Execute queries with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database query timeout")), 10000);
    });

    console.log("🔍 [DEBUG] Starting database queries...");

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

    console.log("✅ [DEBUG] Database queries completed");
    console.log("📊 [DEBUG] Results:", {
      itemsCount: items?.length || 0,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });

    const response = {
      success: true,
      items: items || [],
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    console.log("📤 [DEBUG] Sending response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [DEBUG] GET /api/lost-found error:", error);
    console.error("💥 [DEBUG] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            success: false,
            error: "Request timeout",
            message: "Database query took too long to complete",
          },
          { status: 504 }
        );
      }

      if (
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Database connection failed",
            message: "Unable to connect to database",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new lost and found item
export async function POST(req: NextRequest) {
  console.log("🔥 [DEBUG] POST /api/lost-found called");
  console.log("🌐 [DEBUG] Request URL:", req.url);

  try {
    // Check database connection
    if (!prisma) {
      console.error("❌ [DEBUG] Prisma client not available");
      return NextResponse.json(
        {
          success: false,
          error: "Database connection not available",
          message: "Please check your database configuration",
        },
        { status: 503 }
      );
    }

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log("❌ [DEBUG] No user ID - unauthorized");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Please sign in to report items",
        },
        { status: 401 }
      );
    }

    console.log("👤 [DEBUG] User authenticated:", userId);

    // Parse request body
    const requestData = await req.json();
    console.log("📨 [DEBUG] Request data:", requestData);

    // Validate input data
    const validationErrors = validateLostFoundData(requestData);
    if (validationErrors.length > 0) {
      console.log("❌ [DEBUG] Validation errors:", validationErrors);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Get current user from Clerk
    const clerkUser = await currentUser();
    const user = await ensureUserExists(userId, clerkUser);

    // Prepare item data
    const itemData = {
      userId: user.id,
      type: requestData.type,
      category: requestData.category,
      name: requestData.name.trim(),
      description: requestData.description.trim(),
      location: requestData.location.trim(),
      contact_name: requestData.contactName.trim(),
      contact_phone: requestData.contactPhone.trim(),
      contact_email: requestData.contactEmail?.trim() || null,
      contact_address: requestData.contactAddress?.trim() || null,
      image_url: requestData.imageUrl?.trim() || null,
      location_coordinates: requestData.locationCoordinates || null,
      status: "pending" as const,
    };

    console.log("📝 [DEBUG] Creating item with data:", itemData);

    // Create item and update user points in a transaction
    const [item, updatedUser] = await prisma.$transaction([
      prisma.lostFoundItem.create({
        data: itemData,
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
        where: { id: user.id },
        data: {
          totalPunyaPoints: {
            increment: LOST_FOUND_POINTS,
          },
        },
      }),
    ]);

    console.log("✅ [DEBUG] Item created successfully:", item.id);
    console.log("🎯 [DEBUG] Points awarded:", LOST_FOUND_POINTS);

    const response = {
      success: true,
      item,
      pointsAwarded: LOST_FOUND_POINTS,
      message: `${
        requestData.type === "lost" ? "Lost" : "Found"
      } item reported successfully!`,
    };

    console.log("📤 [DEBUG] Sending success response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [DEBUG] POST /api/lost-found error:", error);
    console.error("💥 [DEBUG] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle specific error types
    if (error instanceof Error) {
      if (
        error.message.includes("validation") ||
        error.message.includes("constraint")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid data provided",
            message: "Please check your input and try again",
          },
          { status: 400 }
        );
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            success: false,
            error: "Request timeout",
            message: "Database operation took too long to complete",
          },
          { status: 504 }
        );
      }

      if (
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Database connection failed",
            message: "Unable to connect to database",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
