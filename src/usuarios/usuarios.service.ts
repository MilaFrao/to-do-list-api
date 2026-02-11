import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CrearUsuarioDTO } from './DTO/crear-usuarios.dto';
import { DbService } from 'src/db/db.service';
import { NotFoundError } from 'rxjs';
import { error } from 'console';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private readonly db:DbService){}

    async findAll(){
        const sql = 'SELECT id, nombre, email, contrasena, fecha_registro FROM usuarios';
        return this.db.query(sql);
    }

    async create(dto: CrearUsuarioDTO){

        const hashedPassword = await bcrypt.hash(dto.contrasena, 10);
        const sql = 'INSERT INTO usuarios (id, nombre, email, contrasena, fecha_registro) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, nombre, email, fecha_registro';

        return this.db.query(sql, [
        dto.id,
        dto.nombre,
        dto.email,
        hashedPassword,
        ]);
    };

    async update(id:number, dto: CrearUsuarioDTO){

        let hashedPassword = dto.contrasena;
        if(dto.contrasena){
            hashedPassword = await bcrypt.hash(dto.contrasena, 10);
        }
        const sql = 'UPDATE usuarios SET nombre = $1, email = $2, contrasena = $3 WHERE id = $4 RETURNING *';

        return this.db.query(sql,[
            dto.nombre,
            dto.email,
            hashedPassword,
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
