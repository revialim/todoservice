import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TodosController } from './app/todos.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController, TodosController],
  providers: [AppService],
})
export class AppModule {}
