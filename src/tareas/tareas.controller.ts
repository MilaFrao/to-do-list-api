import { Controller, Body, Get, Post, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CrearTareaDTO } from './DTO/crear-tareas.dto';
import { ActualizarTareaDTO } from './DTO/actualizar-tareas.dto';

@Controller('tareas')
export class TareasController {
    constructor(private readonly tareaService:TareasService){}

    @Get()
    getTareas(){
        return this.tareaService.findAll();
    }

    // GET /tareas/usuario/5
    @Get('usuario/:usuarioId')
    findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
        return this.tareaService.findByUsuario(usuarioId);
    }

    @Post()
    createTareas(@Body()dto: CrearTareaDTO){
        return this.tareaService.create(dto);
    }

    @Patch(':id')
    updateTareas(@Param('id') id:number, @Body()dto: ActualizarTareaDTO){
        return this.tareaService.update(id,dto);
    }

    @Delete(':id')
    deleteTareas(@Param('id', ParseIntPipe) id:number){
        return this.tareaService.delete(id);
    }    

}
