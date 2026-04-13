import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Please provide the Algorand address'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  role: {
    type: String,
    enum: ['borrower', 'lender', 'admin'],
    default: 'borrower',
  },
  photoUrl: String,
  bio: String,
  location: String,
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
