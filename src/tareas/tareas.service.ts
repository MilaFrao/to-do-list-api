import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CrearTareaDTO } from './DTO/crear-tareas.dto';
import { DbService } from 'src/db/db.service';
import { ActualizarTareaDTO } from './DTO/actualizar-tareas.dto';

@Injectable()
export class TareasService {
  constructor(private readonly db: DbService) {}

  async findAll() {
    const sql = `
      SELECT id, titulo, descripcion, story_points, fecha_entrega, estado, id_creador, fecha_creacion FROM tareas`;
    try {
      const rows = await this.db.query(sql);
      return rows; // db.query devuelve array de rows
    } catch (err) {
      // log si tienes logger
      throw new InternalServerErrorException('Error obteniendo tareas');
    }
  }

  // tareas.service.ts
  async findByUsuario(idUsuario: number) {
      const sql = `
          SELECT t.* FROM tareas t
          INNER JOIN tarea_asigna_usuario tau ON t.id = tau.id_tarea
          WHERE tau.id_usuario = $1`;
      return this.db.query(sql, [idUsuario]);
  }


  async create(dto: CrearTareaDTO) {
    const client = await this.db.getClient();

    try {
        await client.query('BEGIN');

        // Los datos para la tabla 'tareas'
        const sqlTarea = `
            INSERT INTO tareas (id, titulo, descripcion, story_points, fecha_entrega, id_creador)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const resTarea = await client.query(sqlTarea, [
            dto.id, 
            dto.titulo, 
            dto.descripcion, 
            dto.story_points, 
            dto.fecha_entrega, 
            dto.id_creador
        ]);

        const nuevaTarea = resTarea.rows[0];

        // El dato que "sobraba" en el DTO lo usamos aquí
        const sqlRelacion = `
            INSERT INTO tarea_asigna_usuario (id_tarea, id_usuario)
            VALUES ($1, $2)
        `;
        await client.query(sqlRelacion, [nuevaTarea.id, dto.id_usuario_asignado]);

        await client.query('COMMIT');
        return { ...nuevaTarea, id_usuario_asignado: dto.id_usuario_asignado };

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
  }

  async update(id: number, dto: ActualizarTareaDTO){
    const sql = 'UPDATE tareas SET titulo = $1, descripcion = $2, estado = $3 WHERE id = $4 RETURNING *';

    return this.db.query(sql,[
      dto.titulo,
      dto.descripcion,
      dto.estado,
      id
    ]);

  }

  async delete(id: number){
    try{
      const sql = 'DELETE FROM tareas WHERE id = $1 RETURNING id';
      const result = await this.db.query(sql,[id]);

      if(result.length === 0){
        throw new NotFoundException("Tarea no encontrada");
      }
      return{
        message: 'Tarea eliminada correctamente', id: result[0].id,
      };
    }
    catch(error:any){
      if (error.code === '23503'){
        throw new ConflictException('No se puede eliminar la tarea porque tiene registros asociados', );
      }
      throw error;
    }
  }

}
