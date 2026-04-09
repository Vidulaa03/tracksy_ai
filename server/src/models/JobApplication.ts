import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  position: string;
  description: string;
  status: 'applied' | 'interviewing' | 'accepted' | 'rejected';
  appliedDate: Date;
  lastUpdated: Date;
  notes: string;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['applied', 'interviewing', 'accepted', 'rejected'],
      default: 'applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: { createdAt: false, updatedAt: 'lastUpdated' } }
);

export default mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
