import amqp, { Connection, Channel } from 'amqplib';
import { queueConfig } from '../config/queue-config';

export class AmqpAdapter {
  private connection!: any;
  private channel!: Channel;

  async connect(uri: string): Promise<void> {
    this.connection = await amqp.connect(uri);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(queueConfig.getDataQueue, { durable: true });
    await this.channel.assertQueue(queueConfig.setDataQueue, { durable: true });
  }

  consume(queue: string, onMessage: (msg: any) => void): void {
    this.channel.consume(queue, (msg) => {
      if (!msg) return;
      onMessage(msg);
      this.channel.ack(msg);
    });
  }

  publish(queue: string, message: any): void {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async disconnect(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
