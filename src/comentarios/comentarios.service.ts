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
        const sql = 'INSERT INTO comentarios (id, contenido, id_tarea, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *';

        try{
            const rows = await this.db.query(sql, [
                dto.id,
                dto.contenido,
                dto.id_tarea,
                idUsuario]);

            return rows[0];
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

        const rows = await this.db.query(sql, [
            dto.contenido,
            id
        ]);

        return rows[0];

    }

    async delete(id: number){
        const sql = 'DELETE FROM comentarios WHERE id = $1 RETURNING *';
        const rows = await this.db.query(sql, [id]);
        return rows[0];
    }

}
