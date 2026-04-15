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
  borrowerName: String,
  businessName: String,
  story: {
    type: String,
    required: true,
  },
  businessCategory: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'repaid', 'denied'],
    default: 'pending',
  },
  photoUrl: String,
  mannDeshiScore: Number, 
  loanAmount: Number,
  currentFunding: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  network: {
    type: String,
    enum: ['localnet', 'testnet'],
    default: 'localnet',
  },
});

export default mongoose.models.LoanMetadata || mongoose.model('LoanMetadata', LoanMetadataSchema);
