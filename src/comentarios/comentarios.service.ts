import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CrearComentarioDTO } from './DTO/crear-comentarios.dto';
import { DbService } from 'src/db/db.service';
import { ActualizarComentarioDTO } from './DTO/actualizar-comentarios.dto';


@Injectable()
export class ComentariosService {
    constructor(private readonly db: DbService){}

    async findAll(){
        const sql = 'SELECT id, contenido, fecha_comentario, id_usuario, id_tarea FROM comentarios';
        try{
            const rows = await this.db.query(sql);
            return rows;
        } catch(err){
            throw new InternalServerErrorException('Error obteniendo comentarios');
        }
    }

    async create(dto: CrearComentarioDTO){
        const sql = 'INSERT INTO comentarios (id,contenido, fecha_comentario, id_usuario, id_tarea) VALUES ($1, $2, $3, $4, $5) RETURNING *';

        return this.db.query(sql, [
            dto.id,
            dto.fecha_creacion,
            dto.contenido,
            dto.id_usuario,
            dto.id_tarea
        ]);
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
