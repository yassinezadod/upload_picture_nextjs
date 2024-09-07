import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  const { niveau } = await request.json();

  try {
    const newClass = await prisma.class.create({
      data: { niveau },
    });
    return NextResponse.json(newClass);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
