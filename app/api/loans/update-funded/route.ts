import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import LoanMetadata from '@/models/LoanMetadata';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { loanId, fundedAmount } = await request.json();
    
    if (!loanId) {
      return NextResponse.json({ error: 'Loan ID is required' }, { status: 400 });
    }

    // Find the loan and update currentFunding
    // We increment it because multiple people might contribute
    const updatedLoan = await LoanMetadata.findOneAndUpdate(
      { loanId: loanId.toString() },
      { $inc: { currentFunding: Number(fundedAmount) } },
      { new: true }
    );

    if (!updatedLoan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
    }

    console.log(`[SakhiLend DEBUG] Updated funding for loan ${loanId}: +${fundedAmount} USDC`);
    return NextResponse.json(updatedLoan);
  } catch (error: any) {
    console.error('[SakhiLend DEBUG] API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
