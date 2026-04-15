import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import LoanMetadata from '@/models/LoanMetadata';

import { getAlgodConfig } from '@/lib/algorand/client';

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const { network } = getAlgodConfig()

  try {
    const query: any = { network: network || 'localnet' };
    if (address) query.borrowerAddress = address;
    
    console.log(`[API] Fetching loans for network: ${network}. Query:`, query)
    const loans = await LoanMetadata.find(query).sort({ createdAt: -1 });
    return NextResponse.json(loans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
