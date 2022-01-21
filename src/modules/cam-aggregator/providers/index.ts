import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { AggregatorPerfomerSchema } from '../schemas/aggregator-performer-info.schema';
import { AggregatorCategorySchema } from '../schemas/aggregator-category.schema';

export const AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER = 'AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER';
export const AGGREGATOR_TAG_MODEL_PROVIDER = 'AGGREGATOR_TAG_MODEL_PROVIDER';

export const camAggregatorProviders = [
  {
    provide: AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('AggregatorPerformerInfo', AggregatorPerfomerSchema),
    inject: [MONGO_DB_PROVIDER]
  },

  {
    provide: AGGREGATOR_TAG_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('AggregatorCategory', AggregatorCategorySchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
