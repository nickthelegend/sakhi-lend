import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const LoanMetadataSchema = new mongoose.Schema({
  loanId: String,
  borrowerAddress: String,
  borrowerName: String,
  businessName: String,
  status: String,
  createdAt: Date,
});

const LoanMetadata = mongoose.models.LoanMetadata || mongoose.model('LoanMetadata', LoanMetadataSchema);

async function list() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI not found');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const loans = await LoanMetadata.find({}).sort({ createdAt: -1 });
  console.log(`Found ${loans.length} loans`);
  
  loans.forEach(l => {
    console.log(`- [${l.loanId}] ${l.borrowerName} (${l.businessName}) Status: ${l.status} Address: ${l.borrowerAddress}`);
  });

  await mongoose.disconnect();
}

list().catch(console.error);
