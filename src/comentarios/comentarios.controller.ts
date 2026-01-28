import { Controller, Body, Get, Post, Patch, Param } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CrearComentarioDTO } from './DTO/crear-comentarios.dto';
import { ActualizarComentarioDTO } from './DTO/actualizar-comentarios.dto';

@Controller('comentarios')
export class ComentariosController {
    constructor(private readonly comentarioService:ComentariosService){}

    @Get()
    getComentarios(){
        return this.comentarioService.findAll();
    }

    @Post()
    crearComentarios(@Body()dto: CrearComentarioDTO){
        return this.comentarioService.create(dto);
    }

    @Patch(':id')
    actualizarComentario(@Param('id') id: number, @Body()dto: ActualizarComentarioDTO){
        return this.comentarioService.update(id, dto);
    }


}
