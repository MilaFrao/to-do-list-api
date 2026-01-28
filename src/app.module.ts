import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TareasModule } from './tareas/tareas.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsuariosModule, TareasModule, ComentariosModule, CategoriasModule, DbModule, ConfigModule.forRoot({isGlobal:true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
