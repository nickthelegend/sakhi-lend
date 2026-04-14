import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function clearDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined');

  await mongoose.connect(uri);
  console.log('--- Clearing Database ---');
  
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
    console.log(`✅ Deleted all documents from ${collection.collectionName}`);
  }
  
  await mongoose.disconnect();
  console.log('--- Database Clear Complete ---');
}

clearDB().catch(console.error);
