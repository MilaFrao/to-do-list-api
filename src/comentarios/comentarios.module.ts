import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [ComentariosController],
  providers: [ComentariosService]
})
export class ComentariosModule {}
