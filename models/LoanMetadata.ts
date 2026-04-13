import mongoose from 'mongoose';

const LoanMetadataSchema = new mongoose.Schema({
  loanId: {
    type: String,
    required: true,
    unique: true,
  },
  borrowerAddress: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    required: true,
  },
  businessCategory: {
    type: String,
    required: true,
  },
  photoUrl: String,
  mannDeshiScore: Number, // The verified off-chain index
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.LoanMetadata || mongoose.model('LoanMetadata', LoanMetadataSchema);
