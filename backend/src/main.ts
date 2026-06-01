import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ¡LÍNEA CLAVE PARA CONECTAR CON ANGULAR!
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();