import { Controller, Body, Get, Post } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CrearTareaDTO } from './DTO/crear-tareas.dto';

@Controller('tareas')
export class TareasController {
    constructor(private readonly tareaService:TareasService){}

    @Get()
    getTareas(){
        return this.tareaService.findAll();
    }

    @Post()
    createTareas(@Body()dto: CrearTareaDTO){
        return this.tareaService.create(dto);
    }

    

}
