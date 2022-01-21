"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    transport: process.env.MAILER_TRANSPORT || 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY || 'SG.....'
};
//# sourceMappingURL=email.js.map