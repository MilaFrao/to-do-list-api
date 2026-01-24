import { Controller, Body, Get, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDTO } from './DTO/crear-usuarios.dto';

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

}
