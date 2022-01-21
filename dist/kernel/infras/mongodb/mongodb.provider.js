"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDBProviders = exports.MONGO_DB_PROVIDER = void 0;
const mongoose = require("mongoose");
exports.MONGO_DB_PROVIDER = 'MONGO_DB_PROVIDER';
mongoose.set('useCreateIndex', true);
exports.mongoDBProviders = [
    {
        provide: exports.MONGO_DB_PROVIDER,
        useFactory: () => mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
];
//# sourceMappingURL=mongodb.provider.js.map