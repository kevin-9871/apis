"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const nodemailer_1 = require("nodemailer");
const settings_1 = require("../../settings");
const fs_1 = require("fs");
const path_1 = require("path");
const mustache_1 = require("mustache");
const constants_1 = require("../../settings/constants");
const mongoose_1 = require("mongoose");
const exceptions_1 = require("../exceptions");
const providers_1 = require("../providers");
const TEMPLATE_DIR = path_1.join(process.env.TEMPLATE_DIR, 'emails');
let MailerService = class MailerService {
    constructor(queueService, settingService, EmailTemplate) {
        this.queueService = queueService;
        this.settingService = settingService;
        this.EmailTemplate = EmailTemplate;
        this.init();
    }
    async init() {
        this.mailerQueue = this.queueService.createInstance('MAILER_QUEUE');
        this.mailerQueue.process(process.env.MAILER_CONCURRENCY || 1, this.process.bind(this));
    }
    async getTransport() {
        const smtp = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.SMTP_TRANSPORTER);
        if (!smtp || !smtp.host || !smtp.auth || !smtp.port || !smtp.auth.user || !smtp.auth.pass) {
            throw new common_1.HttpException('Invalid confirguration!', 400);
        }
        smtp.port = parseInt(smtp.port, 10);
        return nodemailer_1.createTransport(smtp);
    }
    async getTemplate(template = 'default', isLayout = false) {
        const layout = await this.EmailTemplate.findOne({
            key: isLayout ? `layouts/${template}` : template
        });
        if (layout)
            return layout.content;
        template = kernel_1.StringHelper.getFileName(template, true);
        if (template === 'blank') {
            return isLayout ? '[[BODY]]' : '';
        }
        const layoutFile = isLayout ? path_1.join(TEMPLATE_DIR, 'layouts', `${template}.html`) : path_1.join(TEMPLATE_DIR, `${template}.html`);
        if (!fs_1.existsSync(layoutFile)) {
            return isLayout ? '[[BODY]]' : '';
        }
        return fs_1.readFileSync(layoutFile, 'utf8');
    }
    async process(job, done) {
        try {
            const transport = await this.getTransport();
            const data = job.data;
            let { html } = data;
            let layout = '[[BODY]]';
            let subject = '';
            if (!html && data.template) {
                const template = await this.EmailTemplate.findOne({
                    key: {
                        $in: [
                            data.template,
                            `${data.template}.html`
                        ]
                    }
                });
                if (!template) {
                    html = '';
                    layout = await this.getTemplate(data.layout, true);
                }
                else {
                    html = template.content;
                    subject = template.subject;
                    layout = template.layout ? await this.getTemplate(template.layout, true) : '[[BODY]]';
                }
            }
            const settings = settings_1.SettingService._settingCache;
            const body = html ? mustache_1.render(html, Object.assign(Object.assign({}, data.data), { settings })) : '';
            const siteName = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.SITE_NAME);
            const logoUrl = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.LOGO_URL);
            html = mustache_1.render(layout, {
                siteName: siteName || process.env.SITENAME || process.env.DOMAIN,
                logoUrl,
                subject: subject || data.subject
            }).replace('[[BODY]]', body);
            const senderConfig = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.SENDER_EMAIL);
            const senderEmail = senderConfig || process.env.SENDER_EMAIL;
            await transport.sendMail({
                from: senderEmail,
                to: Array.isArray(data.to) ? data.to.join(',') : data.to,
                cc: Array.isArray(data.cc) ? data.cc.join(',') : data.cc,
                bcc: Array.isArray(data.cc) ? data.cc.join(',') : data.cc,
                subject: subject || data.subject,
                html
            });
        }
        catch (e) {
            console.log('mail_error', e);
        }
        finally {
            done();
        }
    }
    async send(email) {
        await this.mailerQueue.createJob(email).save();
    }
    async verify() {
        try {
            const transport = await this.getTransport();
            const siteName = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.SITE_NAME) || process.env.DOMAIN;
            const senderEmail = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.SENDER_EMAIL) || process.env.SENDER_EMAIL;
            const adminEmail = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.ADMIN_EMAIL) || process.env.ADMIN_EMAIL;
            return transport.sendMail({
                from: senderEmail,
                to: adminEmail,
                subject: `Test email ${siteName}`,
                html: 'Hello, this is test email!'
            });
        }
        catch (e) {
            throw new exceptions_1.EmailVerificationFailureException(e);
        }
    }
    async getAllTemplates() {
        return this.EmailTemplate.find();
    }
    async findOne(id) {
        return this.EmailTemplate.findById(id);
    }
    async updateTemplate(id, payload) {
        const template = await this.EmailTemplate.findById(id);
        if (!template)
            throw new kernel_1.EntityNotFoundException();
        template.subject = payload.subject;
        template.content = payload.content;
        template.layout = payload.layout;
        return template.save();
    }
};
MailerService = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(providers_1.EMAIL_TEMPLATE_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueService,
        settings_1.SettingService,
        mongoose_1.Model])
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.service.js.map