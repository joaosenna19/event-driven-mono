import {
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { StreamsRabbitmqService } from "./streams-rabbitmq.service";
import { Client } from "rabbitmq-stream-js-client";
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
export class EventDrivenMonoStreamsRabbitmqModule
  implements OnModuleDestroy, OnModuleInit
{
  constructor(
    @Inject(STREAMS_RABBITMQ_CONNECTION) private readonly client: Client
  ) {}
  async onModuleInit() {
    await this.client.createStream({
      stream: "event-stream",
      arguments: { "max-length-bytes": 5 * 1e9 },
    });
    Logger.log("RabbitMQ Stream 'event-stream' ensured");
  }
  async onModuleDestroy() {
    await this.client.close();
    Logger.log("RabbitMQ Stream Client disconnected");
  }
}
