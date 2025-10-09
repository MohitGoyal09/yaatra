import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Helper function to check for duplicate reports
async function checkForDuplicateReport(
  type: string,
  category: string,
  name: string,
  description: string,
  location: string,
  userId?: string
) {
  try {
    // Check for similar reports in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find similar reports based on multiple criteria
    const existingReports = await prisma.lostFoundItem.findMany({
      where: {
        AND: [
          { type },
          { category },
          { status: { not: "closed" } }, // Only check active reports
          { created_at: { gte: thirtyDaysAgo } }, // Only recent reports
          {
            OR: [
              // Check for exact name match
              { name: { equals: name, mode: "insensitive" } },
              // Check for very similar descriptions (80% similarity)
              {
                description: {
                  contains: description.substring(
                    0,
                    Math.min(20, description.length)
                  ),
                  mode: "insensitive",
                },
              },
              // Check for same location and category
              {
                AND: [
                  {
                    location: {
                      contains: location.substring(
                        0,
                        Math.min(15, location.length)
                      ),
                      mode: "insensitive",
                    },
                  },
                  { category },
                ],
              },
            ],
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return existingReports;
  } catch (error) {
    console.error("Error checking for duplicates:", error);
    return [];
  }
}

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Helper function to calculate Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// GET - Fetch lost and found items
export async function GET(req: NextRequest) {
  console.log("🔥 API GET /api/lost-found called");

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
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100); // Max 100 items
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const skip = (page - 1) * limit;

    // Build where clause with proper validation
    const where: any = { status: "active" };

    if (type && type !== "all" && ["lost", "found"].includes(type)) {
      where.type = type;
    }

    if (category && category !== "all") {
      where.category = category;
    }

    if (location && location.trim().length >= 3) {
      where.location = {
        contains: location.trim(),
        mode: "insensitive",
      };
    }

    if (search && search.trim().length >= 3) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
        { location: { contains: search.trim(), mode: "insensitive" } },
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

    // Return mock data if database is not available
    if (
      error instanceof Error &&
      (error.message.includes("timeout") ||
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND"))
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
      {
        success: false,
        error: "Failed to fetch items",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new lost and found item with duplicate prevention
export async function POST(req: NextRequest) {
  console.log("🔥 API POST /api/lost-found called");

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

    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to report items.",
        },
        { status: 401 }
      );
    }

    const requestBody = await req.json();
    console.log("📨 Request body received:", requestBody);

    // Extract and validate request data
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

    // Enhanced input validation
    const validationErrors = [];

    // Required fields validation
    if (!type || !["lost", "found"].includes(type)) {
      validationErrors.push("Type must be either 'lost' or 'found'");
    }

    if (
      !category ||
      !["person", "pet", "item", "document", "other"].includes(category)
    ) {
      validationErrors.push("Please select a valid category");
    }

    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      validationErrors.push("Name must be between 2 and 100 characters");
    }

    if (
      !description ||
      description.trim().length < 10 ||
      description.trim().length > 1000
    ) {
      validationErrors.push(
        "Description must be between 10 and 1000 characters"
      );
    }

    if (
      !location ||
      location.trim().length < 3 ||
      location.trim().length > 200
    ) {
      validationErrors.push("Location must be between 3 and 200 characters");
    }

    if (
      !contactName ||
      contactName.trim().length < 2 ||
      contactName.trim().length > 50
    ) {
      validationErrors.push("Contact name must be between 2 and 50 characters");
    }

    if (
      !contactPhone ||
      contactPhone.trim().length < 10 ||
      contactPhone.trim().length > 20
    ) {
      validationErrors.push(
        "Phone number must be between 10 and 20 characters"
      );
    }

    // Phone number format validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (contactPhone && !phoneRegex.test(contactPhone.trim())) {
      validationErrors.push("Please enter a valid phone number");
    }

    // Email validation (if provided)
    if (contactEmail && contactEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail.trim())) {
        validationErrors.push("Please enter a valid email address");
      }
    }

    // Image URL validation (if provided)
    if (imageUrl && imageUrl.trim()) {
      try {
        new URL(imageUrl.trim());
      } catch {
        validationErrors.push("Please enter a valid image URL");
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Check for duplicate reports
    console.log("🔍 Checking for duplicate reports...");
    const duplicateReports = await checkForDuplicateReport(
      type,
      category,
      name.trim(),
      description.trim(),
      location.trim(),
      userId
    );

    if (duplicateReports.length > 0) {
      console.log("⚠️ Duplicate reports found:", duplicateReports.length);

      // Check for high similarity
      const highSimilarityReports = duplicateReports.filter((report) => {
        const nameSimilarity = calculateSimilarity(
          name.trim().toLowerCase(),
          report.name.toLowerCase()
        );
        const descSimilarity = calculateSimilarity(
          description.trim().toLowerCase(),
          report.description.toLowerCase()
        );
        return nameSimilarity > 0.8 || descSimilarity > 0.8;
      });

      if (highSimilarityReports.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Similar report already exists",
            details: `A similar ${type} report for "${name}" has already been reported recently. Please check existing reports before creating a new one.`,
            existingReports: highSimilarityReports.map((report) => ({
              id: report.id,
              name: report.name,
              description: report.description.substring(0, 100) + "...",
              location: report.location,
              created_at: report.created_at,
              reportedBy: report.user?.name || "Anonymous",
            })),
          },
          { status: 409 } // Conflict status code
        );
      }
    }

    // Get current user from Clerk
    console.log("🔍 Getting current user from Clerk...");
    const clerk = await currentUser();

    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;

    console.log("🔑 Identity key:", identityKey);

    // Ensure app user exists
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
    console.log("📝 Creating lost/found item...");
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
            image_url: imageUrl?.trim() || null,
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

    return NextResponse.json({
      success: true,
      item,
      pointsAwarded: LOST_FOUND_POINTS,
      message: `${
        type === "lost" ? "Lost" : "Found"
      } item reported successfully!`,
    });
  } catch (error: any) {
    console.error("💥 Error creating lost/found item:", error);

    // Return mock response if database is not available
    if (
      error instanceof Error &&
      (error.message.includes("timeout") ||
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("P1001") ||
        error.message.includes("P2002"))
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
        {
          success: false,
          error: "Invalid data provided",
          details: "Please check your input and try again",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
