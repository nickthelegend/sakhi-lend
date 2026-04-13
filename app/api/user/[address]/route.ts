import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  await dbConnect();
  const { address } = params;

  try {
    const user = await User.findOne({ address });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { address: string } }
) {
  await dbConnect();
  const { address } = params;
  const body = await request.json();

  try {
    const user = await User.findOneAndUpdate(
      { address },
      { ...body, address },
      { new: true, upsert: true }
    );
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
