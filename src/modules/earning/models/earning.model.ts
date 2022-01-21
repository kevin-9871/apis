import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export class EarningModel extends Document {
  transactionTokenId: ObjectId;

  performerId: ObjectId;

  userId: ObjectId;

  type: string;

  source: string;

  target: string;

  sourceId: ObjectId;

  targetId: ObjectId;

  grossPrice: number;

  netPrice: number;

  commission: number;

  isPaid: boolean;

  createdAt: Date;

  updatedAt: Date;

  paidAt: Date;

  transactionStatus: string;

  conversionRate: number;
}
