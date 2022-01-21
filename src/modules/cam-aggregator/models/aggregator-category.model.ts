import { Document } from 'mongoose';

export class AggregatorCategoryModel extends Document {
  name: string;

  alias: string;

  country: string;

  tags: string[];

  active: boolean;

  createdAt: Date;

  updatedAt: Date;
}
