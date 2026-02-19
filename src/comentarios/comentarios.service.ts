import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CrearComentarioDTO } from './DTO/crear-comentarios.dto';
import { DbService } from 'src/db/db.service';
import { ActualizarComentarioDTO } from './DTO/actualizar-comentarios.dto';


@Injectable()
export class ComentariosService {
    constructor(private readonly db: DbService){}

    async findAll() {
        const sql = `
            SELECT c.id, c.contenido, c.fecha_comentario, u.id AS usuario_id, u.nombre AS usuario_nombre, c.id_tarea FROM comentarios c INNER JOIN usuarios u ON u.id = c.id_usuario ORDER BY c.fecha_comentario DESC`;
        return this.db.query(sql);
        }

    async create(dto: CrearComentarioDTO, idUsuario: number) {
        const sql = 'INSERT INTO comentarios (contenido, id_usuario,id_tarea) VALUES ($1, $2, $3) RETURNING *';

        try{
            const result = await this.db.query(sql, [
                dto.contenido,
                idUsuario,
                dto.id_tarea]);

            return result.rows[0];
        }catch(err: any){
            if(err.code === '23503'){
                throw new BadRequestException('El usuario o la tarea no existe');
            }
            throw err;
        }
    }

    async update(id: number, dto: ActualizarComentarioDTO) {
        const sql = `
            UPDATE comentarios
            SET contenido = $1
            WHERE id = $2
            RETURNING *
        `;

        return this.db.query(sql, [
            dto.contenido,
            id
        ]);

    }

    async delete(id: number){
        const sql = 'DELETE FROM comentarios WHERE id = $1 RETURNING *';
        return this.db.query(sql, [id]);
    }

}
