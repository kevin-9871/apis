"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TEMPLATE_DIR = `${__dirname}/templates`;
require('dotenv').config();
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const view_helper_1 = require("./kernel/helpers/view.helper");
const http_exception_log_filter_1 = require("./kernel/logger/http-exception-log.filter");
const redis_io_adapter_1 = require("./modules/socket/redis-io.adapter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const httpAdapter = app.getHttpAdapter();
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new http_exception_log_filter_1.HttpExceptionLogFilter(httpAdapter));
    app.engine('html', view_helper_1.renderFile);
    app.set('view engine', 'html');
    app.useWebSocketAdapter(new redis_io_adapter_1.RedisIoAdapter(app));
    app.disable('x-powered-by');
    if (process.env.NODE_ENV === 'development') {
        const options = new swagger_1.DocumentBuilder()
            .setTitle('API docs')
            .setDescription('The API docs')
            .setVersion('1.0')
            .addTag('api')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup('apidocs', app, document);
    }
    await app.listen(process.env.HTTP_PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map