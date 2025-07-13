"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmqpAdapter = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const queue_config_1 = require("../config/queue-config");
class AmqpAdapter {
    connect(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield amqplib_1.default.connect(uri);
            this.channel = yield this.connection.createChannel();
            for (const queue of Object.values(queue_config_1.queueConfig)) {
                if (typeof queue === 'string') {
                    yield this.channel.assertQueue(queue, { durable: true });
                }
            }
        });
    }
    publish(queue, message) {
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });
    }
    consume(queue, onMessage) {
        this.channel.consume(queue, (msg) => {
            if (!msg)
                return;
            onMessage(msg);
            this.channel.ack(msg);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.close();
            yield this.connection.close();
        });
    }
}
exports.AmqpAdapter = AmqpAdapter;
