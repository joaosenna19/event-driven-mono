import { Inject, Injectable } from "@nestjs/common";
import { Client, Publisher } from "rabbitmq-stream-js-client";
import { STREAMS_RABBITMQ_CONNECTION } from "./connection.symbol";
import { Logger } from "@nestjs/common";
@Injectable()
export class StreamsRabbitmqService {
  constructor(
    @Inject(STREAMS_RABBITMQ_CONNECTION) private readonly client: Client
  ) {}
  private readonly logger = new Logger(StreamsRabbitmqService.name);

  async createPublisher(stream: string): Promise<Publisher> {
    return this.client.declarePublisher({ stream });
  }

  async publishMessage() {
    try {
      const publisher = await this.createPublisher("event-stream");
      publisher.send(Buffer.from("Hello, RabbitMQ Streams!"));
      this.logger.log("Message published to 'event-stream'");
    } catch (error) {
      this.logger.error("Failed to publish message", error);
    }
  }
}
