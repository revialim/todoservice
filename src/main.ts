import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // resolve cors issue ('Access-Control-Allow-Origin' header not present)
  const cors = require('cors');
  const corsOptions ={
      origin:'http://localhost:3000', //client 
      credentials:true, //Access-Control-Allow-Origin
      // optionSuccessStatus:200
    }
    app.use(cors(corsOptions));

    await app.listen(3001);
  }
bootstrap();
