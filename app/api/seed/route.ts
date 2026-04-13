import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';
import LoanMetadata from '@/models/LoanMetadata';

const DEMO_USERS = [
  {
    address: "BORROWER_DEMO_ADDR", // Will be replaced by actual testnet address during demo
    name: "Priya Sharma",
    role: "borrower",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop",
    bio: "Priya is a sustainable weaver from Satara. She wants to expand her handloom business to support local artisans.",
    location: "Satara, Maharashtra"
  },
  {
    address: "LENDER_DEMO_ADDR",
    name: "Rohan Gupta",
    role: "lender",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
    bio: "Rohan is an impact investor looking to support women-led micro-enterprises.",
    location: "Mumbai, India"
  }
];

const DEMO_LOANS = [
  {
    loanId: "1",
    borrowerAddress: "BORROWER_DEMO_ADDR",
    story: "Expanding my handloom workshop to include 2 more looms and hiring 2 local women.",
    businessCategory: "Textiles & Handloom",
    photoUrl: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=600&auto=format&fit=crop",
    mannDeshiScore: 84
  }
];

export async function GET() {
  await dbConnect();

  try {
    // Clear existing for clean demo seed
    await User.deleteMany({});
    await LoanMetadata.deleteMany({});

    await User.insertMany(DEMO_USERS);
    await LoanMetadata.insertMany(DEMO_LOANS);

    return NextResponse.json({ message: '✅ Database seeded with Priya & Rohan' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
