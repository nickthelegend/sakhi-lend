import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import LoanMetadata from '@/models/LoanMetadata';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  try {
    const query = address ? { borrowerAddress: address } : {};
    const loans = await LoanMetadata.find(query).sort({ createdAt: -1 });
    return NextResponse.json(loans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
