import {
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { StreamsRabbitmqService } from "./streams-rabbitmq.service";
import {
  Client,
  DeclareConsumerParams,
  Offset,
} from "rabbitmq-stream-js-client";
import { STREAMS_RABBITMQ_CONNECTION } from "./connection.symbol";

@Module({
  controllers: [],
  providers: [
    StreamsRabbitmqService,
    {
      provide: STREAMS_RABBITMQ_CONNECTION,
      useFactory: async () => {
        const client: Client = await Client.connect({
          hostname: "localhost",
          port: 5552,
          username: "guest",
          password: "guest",
          vhost: "/",
          addressResolver: { enabled: true },
        });
        Logger.log("RabbitMQ Stream Client connected");
        return client;
      },
    },
  ],
  exports: [StreamsRabbitmqService],
})
export class EventDrivenMonoStreamsRabbitmqConsumerModule
  implements OnModuleDestroy, OnModuleInit
{
  constructor(
    @Inject(STREAMS_RABBITMQ_CONNECTION) private readonly client: Client
  ) {}
  async onModuleInit() {
    const logger = new Logger(
      EventDrivenMonoStreamsRabbitmqConsumerModule.name
    );
    const consumerOptions: DeclareConsumerParams = {
      stream: "event-stream",
      offset: Offset.next(),
      consumerRef: "event-consumer",
    };

    await this.client.declareConsumer(consumerOptions, (msg) => {
      logger.log(`Received message: ${msg.content}`);
      logger.log(`Extracting invoice lines...`);
      setTimeout(() => {
        logger.log(`Invoice lines extracted successfully.`);
      }, 3000);
    });
  }
  async onModuleDestroy() {
    await this.client.close();
    Logger.log("RabbitMQ Stream Client disconnected");
  }
}
