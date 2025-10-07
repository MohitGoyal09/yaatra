import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET - Fetch a specific lost/found item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.lostFoundItem.findUnique({
      where: { id: params.id },
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
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

// PUT - Update a lost/found item (only by the author)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      locationCoordinates,
    } = await req.json();

    // Get user identity
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;

    const appUser = await prisma.user.findFirst({
      where: { phone_number: identityKey },
    });

    if (!appUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user owns the item
    const existingItem = await prisma.lostFoundItem.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (existingItem.userId !== appUser.id) {
      return NextResponse.json(
        { error: "Not authorized to update this item" },
        { status: 403 }
      );
    }

    // Update the item
    const updatedItem = await prisma.lostFoundItem.update({
      where: { id: params.id },
      data: {
        type: type || undefined,
        category: category || undefined,
        name: name?.trim() || undefined,
        description: description?.trim() || undefined,
        location: location?.trim() || undefined,
        contact_name: contactName?.trim() || undefined,
        contact_phone: contactPhone?.trim() || undefined,
        contact_email: contactEmail?.trim() || undefined,
        contact_address: contactAddress?.trim() || undefined,
        image_url: imageUrl || undefined,
        status: status || undefined,
        location_coordinates: locationCoordinates || undefined,
        resolved_at: status === "resolved" ? new Date() : undefined,
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
    });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a lost/found item (only by the author)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user identity
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;

    const appUser = await prisma.user.findFirst({
      where: { phone_number: identityKey },
    });

    if (!appUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user owns the item
    const item = await prisma.lostFoundItem.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.userId !== appUser.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this item" },
        { status: 403 }
      );
    }

    // Delete the item
    await prisma.lostFoundItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
