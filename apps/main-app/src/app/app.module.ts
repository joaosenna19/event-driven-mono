import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventDrivenMonoStreamsRabbitmqModule } from "@event-driven-mono/streams-rabbitmq";

@Module({
  imports: [EventDrivenMonoStreamsRabbitmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
