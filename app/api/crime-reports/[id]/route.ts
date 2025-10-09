import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET - Fetch a specific lost/found item
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔥 API GET /api/lost-found/[id] called");

  try {
    const { id } = await params;
    console.log("📋 Item ID:", id);

    // Validate ID format
    if (!id || typeof id !== "string" || id.length < 10) {
      console.log("❌ Invalid item ID format");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid item ID",
        },
        { status: 400 }
      );
    }

    // Check if Prisma client is available
    if (!prisma) {
      console.error("❌ Prisma client not available");
      return NextResponse.json(
        {
          success: false,
          error: "Database not available",
        },
        { status: 503 }
      );
    }

    console.log("🔍 Fetching item from database...");
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
      console.log("❌ Item not found");
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ Item found:", item.name);
    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("💥 Error fetching item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch item",
        details: error instanceof Error ? error.message : "Unknown error",
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
  console.log("🔥 API PUT /api/lost-found/[id] called");

  try {
    const { id } = await params;
    console.log("📋 Item ID:", id);

    const { userId } = await auth();
    console.log("👤 User ID from auth:", userId);

    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to update items.",
        },
        { status: 401 }
      );
    }

    // Check if Prisma client is available
    if (!prisma) {
      console.error("❌ Prisma client not available");
      return NextResponse.json(
        {
          success: false,
          error: "Database not available",
        },
        { status: 503 }
      );
    }

    // Get current user from Clerk to find the app user
    console.log("🔍 Getting current user from Clerk...");
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;
    console.log("🔑 Identity key:", identityKey);

    // Find the app user
    console.log("👥 Finding app user...");
    const appUser = await prisma.user.findUnique({
      where: { phone_number: identityKey },
    });

    if (!appUser) {
      console.log("❌ App user not found");
      return NextResponse.json(
        {
          success: false,
          error: "User not found. Please ensure you have created a profile.",
        },
        { status: 404 }
      );
    }

    console.log("✅ App user found:", appUser.id);

    // Find the item first to check ownership
    console.log("🔍 Finding item to check ownership...");
    const existingItem = await prisma.lostFoundItem.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingItem) {
      console.log("❌ Item not found");
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 }
      );
    }

    // Check if user is the author or has permission
    console.log(
      "🔐 Checking ownership - Item userId:",
      existingItem.userId,
      "App userId:",
      appUser.id
    );
    if (existingItem.userId !== appUser.id) {
      console.log("❌ User not authorized to update this item");
      return NextResponse.json(
        {
          success: false,
          error: "You can only update your own items",
        },
        { status: 403 }
      );
    }

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
      status,
    } = requestBody;

    // Validation
    console.log("✅ Validating request data...");
    const validationErrors = [];

    if (type && !["lost", "found"].includes(type)) {
      validationErrors.push("Type must be either 'lost' or 'found'");
    }

    if (
      category &&
      !["person", "pet", "item", "document", "other"].includes(category)
    ) {
      validationErrors.push("Invalid category");
    }

    if (name && (name.trim().length < 2 || name.trim().length > 100)) {
      validationErrors.push("Name must be between 2 and 100 characters");
    }

    if (
      description &&
      (description.trim().length < 10 || description.trim().length > 1000)
    ) {
      validationErrors.push(
        "Description must be between 10 and 1000 characters"
      );
    }

    if (
      location &&
      (location.trim().length < 3 || location.trim().length > 200)
    ) {
      validationErrors.push("Location must be between 3 and 200 characters");
    }

    if (
      contactName &&
      (contactName.trim().length < 2 || contactName.trim().length > 50)
    ) {
      validationErrors.push("Contact name must be between 2 and 50 characters");
    }

    if (
      contactPhone &&
      (contactPhone.trim().length < 10 || contactPhone.trim().length > 20)
    ) {
      validationErrors.push(
        "Phone number must be between 10 and 20 characters"
      );
    }

    // Fix status validation to match schema defaults
    if (
      status &&
      !["pending", "active", "resolved", "closed"].includes(status)
    ) {
      validationErrors.push(
        "Status must be pending, active, resolved, or closed"
      );
    }

    if (validationErrors.length > 0) {
      console.log("❌ Validation errors:", validationErrors);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Update the item
    console.log("📝 Updating item...");
    const updatedItem = await prisma.lostFoundItem.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(category && { category }),
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        ...(location && { location: location.trim() }),
        ...(contactName && { contact_name: contactName.trim() }),
        ...(contactPhone && { contact_phone: contactPhone.trim() }),
        ...(contactEmail && { contact_email: contactEmail.trim() }),
        ...(contactAddress && { contact_address: contactAddress.trim() }),
        ...(imageUrl && { image_url: imageUrl.trim() }),
        ...(status && { status }),
        updated_at: new Date(),
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

    console.log("✅ Item updated successfully:", updatedItem.name);
    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: "Item updated successfully",
    });
  } catch (error) {
    console.error("💥 Error updating item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update item",
        details: error instanceof Error ? error.message : "Unknown error",
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
  console.log("🔥 API DELETE /api/lost-found/[id] called");

  try {
    const { id } = await params;
    console.log("📋 Item ID:", id);

    const { userId } = await auth();
    console.log("👤 User ID from auth:", userId);

    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in to delete items.",
        },
        { status: 401 }
      );
    }

    // Check if Prisma client is available
    if (!prisma) {
      console.error("❌ Prisma client not available");
      return NextResponse.json(
        {
          success: false,
          error: "Database not available",
        },
        { status: 503 }
      );
    }

    // Get current user from Clerk to find the app user
    console.log("🔍 Getting current user from Clerk...");
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;
    console.log("🔑 Identity key:", identityKey);

    // Find the app user
    console.log("👥 Finding app user...");
    const appUser = await prisma.user.findUnique({
      where: { phone_number: identityKey },
    });

    if (!appUser) {
      console.log("❌ App user not found");
      return NextResponse.json(
        {
          success: false,
          error: "User not found. Please ensure you have created a profile.",
        },
        { status: 404 }
      );
    }

    console.log("✅ App user found:", appUser.id);

    // Find the item first to check ownership
    console.log("🔍 Finding item to check ownership...");
    const existingItem = await prisma.lostFoundItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      console.log("❌ Item not found");
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 }
      );
    }

    // Check if user is the author
    console.log(
      "🔐 Checking ownership - Item userId:",
      existingItem.userId,
      "App userId:",
      appUser.id
    );
    if (existingItem.userId !== appUser.id) {
      console.log("❌ User not authorized to delete this item");
      return NextResponse.json(
        {
          success: false,
          error: "You can only delete your own items",
        },
        { status: 403 }
      );
    }

    // Delete the item
    console.log("🗑️ Deleting item...");
    await prisma.lostFoundItem.delete({
      where: { id },
    });

    console.log("✅ Item deleted successfully");
    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("💥 Error deleting item:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete item",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
