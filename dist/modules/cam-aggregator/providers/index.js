"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camAggregatorProviders = exports.AGGREGATOR_TAG_MODEL_PROVIDER = exports.AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const aggregator_performer_info_schema_1 = require("../schemas/aggregator-performer-info.schema");
const aggregator_category_schema_1 = require("../schemas/aggregator-category.schema");
exports.AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER = 'AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER';
exports.AGGREGATOR_TAG_MODEL_PROVIDER = 'AGGREGATOR_TAG_MODEL_PROVIDER';
exports.camAggregatorProviders = [
    {
        provide: exports.AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('AggregatorPerformerInfo', aggregator_performer_info_schema_1.AggregatorPerfomerSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    },
    {
        provide: exports.AGGREGATOR_TAG_MODEL_PROVIDER,
        useFactory: (connection) => connection.model('AggregatorCategory', aggregator_category_schema_1.AggregatorCategorySchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map