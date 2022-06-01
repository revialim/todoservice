import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
// resolve cors issue ('Access-Control-Allow-Origin' header not present)
import cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Todo service')
    .setDescription('API to manage a simple todo list.')
    .setVersion('1.0')
    .addTag('todos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const corsOptions = {
    origin: 'http://localhost:3000', //client
    credentials: true, //Access-Control-Allow-Origin
    // optionSuccessStatus:200
  };
  app.use(cors(corsOptions));

  await app.listen(3001);
}
bootstrap();
