import * as mongoose from 'mongoose';

export const AggregatorCategorySchema = new mongoose.Schema({
  name: String,
  alias: {
    type: String,
    index: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: 'true'
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
