import { StreamsRabbitmqService } from "@event-driven-mono/streams-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor(
    private readonly streamsRabbitmqService: StreamsRabbitmqService
  ) {}
  async publishEvent(): Promise<void> {
    await this.streamsRabbitmqService.publishMessage("Invoice uploaded");
  }
}
