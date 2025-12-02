import { Module } from "@nestjs/common";
import { EventDrivenMonoStreamsRabbitmqConsumerModule } from "@event-driven-mono/streams-rabbitmq";

@Module({
  imports: [EventDrivenMonoStreamsRabbitmqConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
