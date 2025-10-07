
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        totalPunyaPoints: true,
      },
      orderBy: {
        totalPunyaPoints: 'desc',
      },
      take: limit,
    });

    const leaderboardData = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}