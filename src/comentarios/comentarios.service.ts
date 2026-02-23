import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CrearComentarioDTO } from './DTO/crear-comentarios.dto';
import { DbService } from 'src/db/db.service';
import { ActualizarComentarioDTO } from './DTO/actualizar-comentarios.dto';


@Injectable()
export class ComentariosService {
    constructor(private readonly db: DbService){}

    //cristian: findAll modificado para traer el nombre
    //  del usuario que hizo el comentario y ordenarlos por fecha de comentario descendente
    async findAll() {
        const sql = `
            SELECT c.id, c.contenido, c.fecha_comentario, u.id AS usuario_id, u.nombre AS usuario_nombre, c.id_tarea FROM comentarios c INNER JOIN usuarios u ON u.id = c.id_usuario ORDER BY c.fecha_comentario DESC`;
        const rows = await this.db.query(sql);

        // Deduplicar por id por si la consulta devuelve filas repetidas
        const map = new Map<number, any>();
        for (const r of rows) {
            if (!map.has(r.id)) {
                map.set(r.id, {
                    id: r.id,
                    contenido: r.contenido,
                    fecha_comentario: r.fecha_comentario,
                    usuario: { id: r.usuario_id, nombre: r.usuario_nombre },
                    id_tarea: r.id_tarea,
                });
            }
        }

        return Array.from(map.values());
        }

    //cristian: nuevo método para traer los comentarios de una tarea específica
    //  también trae el nombre del usuario que hizo cada comentario y los ordena por fecha de comentario descendente
    async findByTarea(idTarea: number) {
        try {
            // Verificar que la tarea exista
            const tarea = await this.db.query('SELECT id FROM tareas WHERE id = $1', [idTarea]);
            if (!tarea || tarea.length === 0) {
                throw new NotFoundException('Tarea no encontrada');
            }

            const sql = `
                SELECT c.id, c.contenido, c.fecha_comentario, u.id AS usuario_id, u.nombre AS usuario_nombre FROM comentarios c INNER JOIN usuarios u ON u.id = c.id_usuario WHERE c.id_tarea = $1 ORDER BY c.fecha_comentario DESC`;
            const rows = await this.db.query(sql, [idTarea]);

            if (!rows || rows.length === 0) {
                // No hay comentarios para la tarea: devolver arreglo vacío
                return [];
            }

            const map = new Map<number, any>();
            for (const r of rows) {
                if (!map.has(r.id)) {
                    map.set(r.id, {
                        id: r.id,
                        contenido: r.contenido,
                        fecha_comentario: r.fecha_comentario,
                        usuario: { id: r.usuario_id, nombre: r.usuario_nombre },
                    });
                }
            }

            return Array.from(map.values());
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error al obtener comentarios');
        }
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
        const id_tarea = await this.db.query('SELECT id_tarea FROM comentarios WHERE id = $1', [id]);
        if(!id_tarea || id_tarea.length === 0){
            throw new NotFoundException('Comentario no encontrado');
        }
        const sql = 'DELETE FROM comentarios WHERE id = $1 RETURNING *';
        const rows = await this.db.query(sql, [id]);
        return {
            message: 'Comentario eliminado de la tarea ' + id_tarea[0].id_tarea, 
            comentario: rows[0]
        } 
    }

}
