import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CrearUsuarioDTO } from './DTO/crear-usuarios.dto';
import { DbService } from 'src/db/db.service';
import { NotFoundError } from 'rxjs';
import { error } from 'console';

@Injectable()
export class UsuariosService {
    constructor(private readonly db:DbService){}

    async findAll(){
        const sql = 'SELECT id, nombre, email, contrasena, fecha_registro FROM usuarios';
        return this.db.query(sql);
    }

    async create(dto: CrearUsuarioDTO){
        const sql = 'INSERT INTO usuarios (id, nombre, email, contrasena) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, contrasena';

        return this.db.query(sql, [
        dto.id,
        dto.nombre,
        dto.email,
        dto.contrasena,
        ]);
    };

    async update(id:number, dto: CrearUsuarioDTO){
        const sql = 'UPDATE usuarios SET nombre = $1, email = $2, contrasena = $3 WHERE id = $4 RETURNING *';

        return this.db.query(sql,[
            dto.nombre,
            dto.email,
            dto.contrasena,
            id
        ]);
    }

    async delete(id:number){
        try{
            const sql = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
            const result = await this.db.query(sql,[id]);

            if(result.length === 0 ){
                throw new NotFoundException("Usuario no encontrado");
            }
            return{
                message: 'Usuario eliminado correctamente', id: result[0].id,
            };
        }catch (error:any){
            if(error.code === '23503'){
                throw new ConflictException('No se puede eliminar el usuario porque tiene registros asociados', );
            }
            throw error;
        }
    }
}
