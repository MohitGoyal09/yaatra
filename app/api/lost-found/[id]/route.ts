import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Constants
const VALID_TYPES = ["lost", "found"] as const;
const VALID_CATEGORIES = [
  "person",
  "pet",
  "item",
  "document",
  "other",
] as const;
const VALID_STATUSES = ["pending", "active", "resolved", "closed"] as const;

// Helper function to validate input data for updates
function validateUpdateData(data: any) {
  const errors: string[] = [];

  // Optional fields with validation
  if (data.type !== undefined && !VALID_TYPES.includes(data.type)) {
    errors.push("Type must be either 'lost' or 'found'");
  }

  if (
    data.category !== undefined &&
    !VALID_CATEGORIES.includes(data.category)
  ) {
    errors.push("Category must be one of: person, pet, item, document, other");
  }

  if (data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      data.name.trim().length < 2 ||
      data.name.trim().length > 100
    ) {
      errors.push("Name must be between 2 and 100 characters");
    }
  }

  if (data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      data.description.trim().length < 10 ||
      data.description.trim().length > 1000
    ) {
      errors.push("Description must be between 10 and 1000 characters");
    }
  }

  if (data.location !== undefined) {
    if (
      typeof data.location !== "string" ||
      data.location.trim().length < 3 ||
      data.location.trim().length > 200
    ) {
      errors.push("Location must be between 3 and 200 characters");
    }
  }

  if (data.contactName !== undefined) {
    if (
      typeof data.contactName !== "string" ||
      data.contactName.trim().length < 2 ||
      data.contactName.trim().length > 50
    ) {
      errors.push("Contact name must be between 2 and 50 characters");
    }
  }

  if (data.contactPhone !== undefined) {
    if (
      typeof data.contactPhone !== "string" ||
      data.contactPhone.trim().length < 10 ||
      data.contactPhone.trim().length > 20
    ) {
      errors.push("Contact phone must be between 10 and 20 characters");
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(data.contactPhone.trim())) {
        errors.push("Please enter a valid phone number");
      }
    }
  }

  if (
    data.contactEmail !== undefined &&
    data.contactEmail !== null &&
    data.contactEmail.trim()
  ) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail.trim())) {
      errors.push("Please enter a valid email address");
    }
  }

  if (
    data.imageUrl !== undefined &&
    data.imageUrl !== null &&
    data.imageUrl.trim()
  ) {
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

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ phone_number: identityKey }, { id: userId }],
    },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  console.log("✅ [DEBUG] User found:", user.id);
  return user;
}

// GET - Fetch a specific lost/found item
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥 [DEBUG] GET /api/lost-found/[id] called");
  console.log("🌐 [DEBUG] Request URL:", req.url);

  try {
    const { id } = await params;
    console.log("📋 [DEBUG] Item ID:", id);

    // Validate ID format
    if (!id || typeof id !== "string" || id.length < 10) {
      console.log("❌ [DEBUG] Invalid item ID format");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid item ID format",
          message: "Item ID must be at least 10 characters long",
        },
        { status: 400 }
      );
    }

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

    console.log("🔍 [DEBUG] Fetching item from database...");

    const item = await prisma.lostFoundItem.findUnique({
      where: { id },
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

    if (!item) {
      console.log("❌ [DEBUG] Item not found");
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
          message: "The requested item does not exist",
        },
        { status: 404 }
      );
    }

    console.log("✅ [DEBUG] Item found:", item.name);

    const response = {
      success: true,
      item,
    };

    console.log("📤 [DEBUG] Sending response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [DEBUG] GET /api/lost-found/[id] error:", error);
    console.error("💥 [DEBUG] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

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

// PUT - Update a lost/found item (only by the author)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥 [DEBUG] PUT /api/lost-found/[id] called");
  console.log("🌐 [DEBUG] Request URL:", req.url);

  try {
    const { id } = await params;
    console.log("📋 [DEBUG] Item ID:", id);

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log("❌ [DEBUG] No user ID - unauthorized");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Please sign in to update items",
        },
        { status: 401 }
      );
    }

    console.log("👤 [DEBUG] User authenticated:", userId);

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

    // Parse request body
    const requestData = await req.json();
    console.log("📨 [DEBUG] Request data:", requestData);

    // Validate input data
    const validationErrors = validateUpdateData(requestData);
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

    // Check if item exists and user owns it
    console.log("🔍 [DEBUG] Finding item to check ownership...");
    const existingItem = await prisma.lostFoundItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      console.log("❌ [DEBUG] Item not found");
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
          message: "The requested item does not exist",
        },
        { status: 404 }
      );
    }

    // Check ownership
    console.log(
      "🔐 [DEBUG] Checking ownership - Item userId:",
      existingItem.userId,
      "App userId:",
      user.id
    );
    if (existingItem.userId !== user.id) {
      console.log("❌ [DEBUG] User not authorized to update this item");
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
          message: "You can only update your own items",
        },
        { status: 403 }
      );
    }

    // Build update data object (only include provided fields)
    const updateData: any = {};
    if (requestData.type !== undefined) updateData.type = requestData.type;
    if (requestData.category !== undefined)
      updateData.category = requestData.category;
    if (requestData.name !== undefined)
      updateData.name = requestData.name.trim();
    if (requestData.description !== undefined)
      updateData.description = requestData.description.trim();
    if (requestData.location !== undefined)
      updateData.location = requestData.location.trim();
    if (requestData.contactName !== undefined)
      updateData.contact_name = requestData.contactName.trim();
    if (requestData.contactPhone !== undefined)
      updateData.contact_phone = requestData.contactPhone.trim();
    if (requestData.contactEmail !== undefined)
      updateData.contact_email = requestData.contactEmail?.trim() || null;
    if (requestData.contactAddress !== undefined)
      updateData.contact_address = requestData.contactAddress?.trim() || null;
    if (requestData.imageUrl !== undefined)
      updateData.image_url = requestData.imageUrl?.trim() || null;
    if (requestData.locationCoordinates !== undefined)
      updateData.location_coordinates = requestData.locationCoordinates;

    console.log("📝 [DEBUG] Update data:", updateData);

    // Update the item
    console.log("📝 [DEBUG] Updating item...");
    const updatedItem = await prisma.lostFoundItem.update({
      where: { id },
      data: updateData,
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

    console.log("✅ [DEBUG] Item updated successfully");

    const response = {
      success: true,
      item: updatedItem,
      message: "Item updated successfully",
    };

    console.log("📤 [DEBUG] Sending response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [DEBUG] PUT /api/lost-found/[id] error:", error);
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

      if (error.message.includes("User not found")) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
            message: "Please ensure you have created a profile",
          },
          { status: 404 }
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

// DELETE - Delete a lost/found item (only by the author)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥 [DEBUG] DELETE /api/lost-found/[id] called");
  console.log("🌐 [DEBUG] Request URL:", req.url);

  try {
    const { id } = await params;
    console.log("📋 [DEBUG] Item ID:", id);

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.log("❌ [DEBUG] No user ID - unauthorized");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Please sign in to delete items",
        },
        { status: 401 }
      );
    }

    console.log("👤 [DEBUG] User authenticated:", userId);

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

    // Get current user from Clerk
    const clerkUser = await currentUser();
    const user = await ensureUserExists(userId, clerkUser);

    // Check if item exists and user owns it
    console.log("🔍 [DEBUG] Finding item to check ownership...");
    const existingItem = await prisma.lostFoundItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      console.log("❌ [DEBUG] Item not found");
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
          message: "The requested item does not exist",
        },
        { status: 404 }
      );
    }

    // Check ownership
    console.log(
      "🔐 [DEBUG] Checking ownership - Item userId:",
      existingItem.userId,
      "App userId:",
      user.id
    );
    if (existingItem.userId !== user.id) {
      console.log("❌ [DEBUG] User not authorized to delete this item");
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
          message: "You can only delete your own items",
        },
        { status: 403 }
      );
    }

    // Delete the item
    console.log("🗑️ [DEBUG] Deleting item...");
    await prisma.lostFoundItem.delete({
      where: { id },
    });

    console.log("✅ [DEBUG] Item deleted successfully");

    const response = {
      success: true,
      message: "Item deleted successfully",
    };

    console.log("📤 [DEBUG] Sending response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 [DEBUG] DELETE /api/lost-found/[id] error:", error);
    console.error("💥 [DEBUG] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("User not found")) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
            message: "Please ensure you have created a profile",
          },
          { status: 404 }
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
