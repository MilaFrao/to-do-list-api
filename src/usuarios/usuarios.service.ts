import { Injectable } from '@nestjs/common';
import { CrearUsuarioDTO } from './DTO/crear-usuarios.dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsuariosService {
    constructor(private readonly db:DbService){}

    async findAll(){
        const sql = 'SELECT id, nombre, email, contrasena, fecha_de_registro FROM usuarios';
        return this.db.query(sql);
    }

    async create(dto: CrearUsuarioDTO){
        const sql = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, email';

        return this.db.query(sql, [
        dto.nombre,
        dto.email,
        dto.contrasena,
        ]);
    };

}
