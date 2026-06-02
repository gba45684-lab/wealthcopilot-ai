import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const commissions = await prisma.commission.findMany({
      where: { distributorId: user.id },
      include: { client: true },
      orderBy: { transactionDate: 'desc' },
    });

    const stats = {
      totalCommissions: commissions.reduce((sum, c) => sum + c.amount, 0),
      pendingCommissions: commissions
        .filter(c => c.status === 'PENDING')
        .reduce((sum, c) => sum + c.amount, 0),
      paidCommissions: commissions
        .filter(c => c.status === 'PAID')
        .reduce((sum, c) => sum + c.amount, 0),
      totalCount: commissions.length,
    };

    return NextResponse.json({ commissions, stats });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();

    const commission = await prisma.commission.create({
      data: {
        ...body,
        distributorId: user.id,
      },
    });

    return NextResponse.json(commission, { status: 201 });
  } catch (error) {
    console.error('Error creating commission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
