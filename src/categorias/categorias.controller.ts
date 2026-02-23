import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CrearCategoriaDTO } from './DTO/crear-categoria.dto';
import { ActualizarCategoriaDTO } from './DTO/actualizar-categoria.dto';

@Controller('categorias')
export class CategoriasController {
    constructor(private readonly categoriasService:CategoriasService){}

    @Get()
    getCategorias(){
        return this.categoriasService.findAll();
    }

    @Post()
    createCategorias(@Body()dto:CrearCategoriaDTO){
        return this.categoriasService.create(dto);
    }

    @Patch(':id')
    updateCategorias(@Param('id')id:number,@Body()dto:ActualizarCategoriaDTO){
        return this.categoriasService.update(id,dto);
    }

}
