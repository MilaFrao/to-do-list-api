import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TareasModule } from './tareas/tareas.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [UsuariosModule, TareasModule, ComentariosModule, CategoriasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
