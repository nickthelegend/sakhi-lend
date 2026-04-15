import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongoose'
import LoanMetadata from '@/models/LoanMetadata'
import { getAlgodConfig } from '@/lib/algorand/client'

export async function POST(request: Request) {
  await dbConnect()
  try {
    const data = await request.json()
    const { network } = getAlgodConfig()
    console.log(`[API] Creating Loan Metadata for network ${network}:`, data.loanId)
    
    const loan = await LoanMetadata.create({
      ...data,
      network: network || 'localnet',
      status: 'pending'
    })
    
    return NextResponse.json(loan)
  } catch (error: any) {
    console.error('[API Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
