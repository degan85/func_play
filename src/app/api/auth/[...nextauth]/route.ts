// Temporarily disable authentication for deployment
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Authentication temporarily disabled' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Authentication temporarily disabled' });
}