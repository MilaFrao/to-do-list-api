import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module, ValidationPipe } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DbModule } from './db/db.module';
import 'dotenv/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    UsuariosModule,
  ],
})
export class AppModule{}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true, forbidNonWhitelisted:true, transform:true }),);
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
