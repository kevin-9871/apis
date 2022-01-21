"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redisIoAdapter = require("socket.io-redis");
const nestjs_config_1 = require("nestjs-config");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    createIOServer(port, options) {
        const redisAdapter = redisIoAdapter(nestjs_config_1.ConfigService.get('redis'));
        const server = super.createIOServer(port, options);
        server.adapter(redisAdapter);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map