import { Controller, Body, Get, Post, Patch, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDTO } from './DTO/crear-usuarios.dto';
import { ActualizarUsuarioDTO } from './DTO/actualizar-usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuarioService:UsuariosService){}

    @Get()
    getUsuarios(){
        return this.usuarioService.findAll();
    }

    @Post()
    createUsuarios(@Body()dto: CrearUsuarioDTO){
        return this.usuarioService.create(dto);
    }

    @Patch(':id')
    updateUsuarios(@Param('id')id:number, @Body() dto: ActualizarUsuarioDTO){
        return this.usuarioService.update(id, dto);
    }
}
