import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import LoanMetadata from '@/models/LoanMetadata';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { loanId, status } = await req.json();
    const updated = await LoanMetadata.findOneAndUpdate(
      { loanId },
      { status },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
