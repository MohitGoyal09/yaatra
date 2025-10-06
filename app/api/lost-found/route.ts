import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// GET - Fetch lost and found items
export async function GET(req: NextRequest) {
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
    const items = await prisma.lostFoundItem.findMany({
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
    const totalCount = await prisma.lostFoundItem.count({ where });

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
  try {
    const { userId } = await auth();
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
      locationCoordinates,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !type ||
      !category ||
      !name ||
      !description ||
      !location ||
      !contactName ||
      !contactPhone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure app user exists
    const clerk = await currentUser();
    const identityKey =
      clerk?.primaryEmailAddress?.emailAddress ||
      clerk?.phoneNumbers?.[0]?.phoneNumber ||
      userId;

    const appUser = await prisma.user.upsert({
      where: { phone_number: identityKey },
      update: {},
      create: {
        phone_number: identityKey,
        name: clerk?.fullName || clerk?.username || undefined,
        language_preference: "English",
        totalPunyaPoints: 0,
      },
    });

    // Create the lost/found item
    const item = await prisma.lostFoundItem.create({
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
    await prisma.user.update({
      where: { id: appUser.id },
      data: {
        totalPunyaPoints: {
          increment: LOST_FOUND_POINTS,
        },
      },
    });

    return NextResponse.json({
      success: true,
      item,
      pointsAwarded: LOST_FOUND_POINTS,
    });
  } catch (error) {
    console.error("Error creating lost/found item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
