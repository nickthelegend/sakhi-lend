import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db/mongoose'
import LoanMetadata from '@/models/LoanMetadata'

export async function POST(request: Request) {
  await dbConnect()
  try {
    const data = await request.json()
    console.log('[API] Creating Loan Metadata:', data.loanId)
    
    const loan = await LoanMetadata.create({
      ...data,
      status: 'pending'
    })
    
    return NextResponse.json(loan)
  } catch (error: any) {
    console.error('[API Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
