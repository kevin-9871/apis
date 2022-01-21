"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplateProviders = exports.EMAIL_TEMPLATE_PROVIDER = void 0;
const kernel_1 = require("../../../kernel");
const email_template_schema_1 = require("../schemas/email-template.schema");
exports.EMAIL_TEMPLATE_PROVIDER = 'EMAIL_TEMPLATE_PROVIDER';
exports.emailTemplateProviders = [
    {
        provide: exports.EMAIL_TEMPLATE_PROVIDER,
        useFactory: (connection) => connection.model('EmailTemplate', email_template_schema_1.EmailTemplateSchema),
        inject: [kernel_1.MONGO_DB_PROVIDER]
    }
];
//# sourceMappingURL=index.js.map