"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationDto = void 0;
const lodash_1 = require("lodash");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
class ConversationDto {
    constructor(data) {
        Object.assign(this, lodash_1.pick(data, [
            '_id',
            'type',
            'name',
            'recipients',
            'lastMessage',
            'lastSenderId',
            'lastMessageCreatedAt',
            'streamId',
            'meta',
            'createdAt',
            'updatedAt',
            'recipientInfo',
            'totalNotSeenMessages',
            'performerId'
        ]));
    }
    serializeConversation() {
        return `conversation:${this.type}:${this._id}`;
    }
}
exports.ConversationDto = ConversationDto;
//# sourceMappingURL=conversation.dto.js.map