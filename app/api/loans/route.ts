import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import LoanMetadata from '@/models/LoanMetadata';

export async function GET() {
  await dbConnect();

  try {
    const loans = await LoanMetadata.find({}).sort({ createdAt: -1 });
    return NextResponse.json(loans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
