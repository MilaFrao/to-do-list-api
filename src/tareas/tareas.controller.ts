import { Controller, Body, Get, Post, Delete, Param, ParseIntPipe, Patch, UseGuards, Query } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CrearTareaDTO } from './DTO/crear-tareas.dto';
import { ActualizarTareaDTO } from './DTO/actualizar-tareas.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Req } from '@nestjs/common';


@UseGuards(JwtAuthGuard)
@Controller('tareas')
export class TareasController {
    constructor(private readonly tareaService:TareasService){}
    @Get()
    getTareas(@Query('usuario') usuario?: number, @Query('estado') estado?: string,) {
        return this.tareaService.findAll(usuario, estado);
    }
    
    @Get(':id')
    getDetalleTarea(@Param('id', ParseIntPipe)id: number){
        return this.tareaService.findDetalle(id);
    }

    @Post()
    create(@Body()dto: CrearTareaDTO, @Req()req: any){
        return this.tareaService.create(dto, req.user.id);
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
