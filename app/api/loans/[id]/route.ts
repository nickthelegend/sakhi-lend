import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import LoanMetadata from '@/models/LoanMetadata';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  try {
    const loan = await LoanMetadata.findOne({ loanId: id });
    if (!loan) {
      return NextResponse.json({ error: 'Loan metadata not found' }, { status: 404 });
    }
    return NextResponse.json(loan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
