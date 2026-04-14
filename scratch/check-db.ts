import dbConnect from './lib/db/mongoose';
import LoanMetadata from './models/LoanMetadata';

async function checkDb() {
  await dbConnect();
  const loans = await LoanMetadata.find({});
  console.log(`Found ${loans.length} loans in DB`);
  console.log(JSON.stringify(loans, null, 2));
  process.exit(0);
}

checkDb();
