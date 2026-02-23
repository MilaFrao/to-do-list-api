import { Controller, Body, Get, Post, Patch, Param, Req, Delete } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CrearComentarioDTO } from './DTO/crear-comentarios.dto';
import { ActualizarComentarioDTO } from './DTO/actualizar-comentarios.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('comentarios')
export class ComentariosController {
    constructor(private readonly comentarioService:ComentariosService){}

    @Get()
    getComentarios(){
        return this.comentarioService.findAll();
    }

    @Get('tarea/:id')
    getComentariosByTarea(@Param('id') id: number){
        return this.comentarioService.findByTarea(id);
    }

    @Post()
    crearComentarios(@Body()dto: CrearComentarioDTO, @Req()req: any){
        return this.comentarioService.create(dto, req.user.id);
    }

    @Patch(':id')
    actualizarComentario(@Param('id') id: number, @Body()dto: ActualizarComentarioDTO){
        return this.comentarioService.update(id, dto);
    }

    @Delete(':id')
    eliminarComentario(@Param('id') id: number){
        return this.comentarioService.delete(id);
    }
}
