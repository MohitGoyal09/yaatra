
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// PATCH - Update crime report status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    // Validate status
    const validStatuses = ["reported", "investigating", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedReport = await prisma.crimeReport.update({
      where: { id },
      data: {
        status,
        resolved_at: status === "resolved" ? new Date() : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone_number: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}