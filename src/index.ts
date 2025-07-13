import { AmqpAdapter } from './adapter/amqp-adapter';
import { UserStatsRepository } from './repository/user-stats-repository';
import { queueConfig } from './config/queue-config';
import 'dotenv/config';

const amqpUri = process.env.RABBITMQ_DEFAULT_SERVER!;
const amqp = new AmqpAdapter();
const repo = new UserStatsRepository();

(async () => {
  await amqp.connect(amqpUri);

  amqp.consume(queueConfig.getDataQueue, async (msg) => {
    const content = JSON.parse(msg.content.toString());
    console.log("message received: ", content)
    const userId = content.id;

    const stats = await repo.getUserStats(userId);

    const payload = {
      userId: stats.userId,
      maxClicks: stats.max_clicks,
      clicksPerSecond: stats.clicks_per_second,
      lastClickAt: stats.last_click_at,
      originData: content,
      processedAt: new Date().toISOString(),
    };

    amqp.publish(queueConfig.setDataQueue, payload);
    console.log('Processado e enviado para setData:', payload);
  });

  console.log('Microserviço escutando getDataQueue...');
})();
