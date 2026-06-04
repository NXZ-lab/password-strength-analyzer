import { Schema, model, Types } from 'mongoose';

export interface IPasswordHistory {
  userId: Types.ObjectId;
  hash: string;
  score: number;
  label: string;
  breached: boolean;
  reused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const passwordHistorySchema = new Schema<IPasswordHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hash: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    breached: {
      type: Boolean,
      default: false,
    },
    reused: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

passwordHistorySchema.index({ userId: 1, createdAt: -1 });

export const PasswordHistory = model<IPasswordHistory>('PasswordHistory', passwordHistorySchema);
