import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET - Fetch a specific lost/found item
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ID format
    if (!id || typeof id !== 'string' || id.length < 10) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid item ID" 
        }, 
        { status: 400 }
      );
    }

    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: "Database not available"
      }, { status: 503 });
    }

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
      return NextResponse.json(
        { 
          success: false,
          error: "Item not found" 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch item",
        details: error instanceof Error ? error.message : "Unknown error"
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
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized. Please sign in to update items." 
        }, 
        { status: 401 }
      );
    }

    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: "Database not available"
      }, { status: 503 });
    }

    // Find the item first to check ownership
    const existingItem = await prisma.lostFoundItem.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { 
          success: false,
          error: "Item not found" 
        }, 
        { status: 404 }
      );
    }

    // Check if user is the author or has permission
    if (existingItem.userId !== userId) {
      return NextResponse.json(
        { 
          success: false,
          error: "You can only update your own items" 
        }, 
        { status: 403 }
      );
    }

    const requestBody = await req.json();
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
    const validationErrors = [];

    if (type && !["lost", "found"].includes(type)) {
      validationErrors.push("Type must be either 'lost' or 'found'");
    }

    if (category && !["person", "pet", "item", "document", "other"].includes(category)) {
      validationErrors.push("Invalid category");
    }

    if (name && (name.trim().length < 2 || name.trim().length > 100)) {
      validationErrors.push("Name must be between 2 and 100 characters");
    }

    if (description && (description.trim().length < 10 || description.trim().length > 1000)) {
      validationErrors.push("Description must be between 10 and 1000 characters");
    }

    if (location && (location.trim().length < 3 || location.trim().length > 200)) {
      validationErrors.push("Location must be between 3 and 200 characters");
    }

    if (contactName && (contactName.trim().length < 2 || contactName.trim().length > 50)) {
      validationErrors.push("Contact name must be between 2 and 50 characters");
    }

    if (contactPhone && (contactPhone.trim().length < 10 || contactPhone.trim().length > 20)) {
      validationErrors.push("Phone number must be between 10 and 20 characters");
    }

    if (status && !["active", "resolved", "closed"].includes(status)) {
      validationErrors.push("Status must be active, resolved, or closed");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Validation failed",
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Update the item
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

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: "Item updated successfully",
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update item",
        details: error instanceof Error ? error.message : "Unknown error"
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
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized. Please sign in to delete items." 
        }, 
        { status: 401 }
      );
    }

    // Check if Prisma client is available
    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: "Database not available"
      }, { status: 503 });
    }

    // Find the item first to check ownership
    const existingItem = await prisma.lostFoundItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { 
          success: false,
          error: "Item not found" 
        }, 
        { status: 404 }
      );
    }

    // Check if user is the author
    if (existingItem.userId !== userId) {
      return NextResponse.json(
        { 
          success: false,
          error: "You can only delete your own items" 
        }, 
        { status: 403 }
      );
    }

    // Delete the item
    await prisma.lostFoundItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to delete item",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}