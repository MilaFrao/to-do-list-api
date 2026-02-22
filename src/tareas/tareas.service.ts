import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CrearTareaDTO } from './DTO/crear-tareas.dto';
import { DbService } from 'src/db/db.service';
import { ActualizarTareaDTO } from './DTO/actualizar-tareas.dto';

@Injectable()
export class TareasService {
  constructor(private readonly db: DbService) {}

  async findUnDetalle(idTarea: number){
    const tareaSql = 'SELECT id, titulo, descripcion, story_points, fecha_entrega, estado, id_creador, fecha_creacion FROM tareas WHERE id = $1';
    const tareas = await this.db.query(tareaSql, [idTarea]);

    if(tareas.length === 0){
      throw new NotFoundException('Tarea no encontrada');
    }
    const tarea = tareas[0];

    const comentariosSql = 'SELECT c.id, c.contenido, c.fecha_comentario, u.id AS usuario_id, u.nombre AS usuario_nombre FROM comentarios c JOIN usuarios u ON u.id = c.id_usuario WHERE c.id_tarea = $1 ORDER BY c.fecha_comentario ASC';
    const comentarios = await this.db.query(comentariosSql,[idTarea]);

    const categoriasSql = 'SELECT cat.id, cat.nombre, cat.color FROM categorias cat JOIN tarea_posee_categoria tpc ON tpc.id_categoria = cat.id WHERE tpc.id_tarea = $1';
    const categorias = await this.db.query(categoriasSql,[idTarea]);

    return {
      ...tarea,
      comentarios,
      categorias,
    };
  }

  async findDetalle(id: number) {
    const tareaSql = `
      SELECT id, titulo, descripcion, story_points, fecha_entrega, estado, id_creador, fecha_creacion FROM tareas WHERE id = $1
    `;
  
    const tareas = await this.db.query(tareaSql, [id]);
  
    if (tareas.length === 0) {
      throw new NotFoundException('Tarea no encontrada');
    }
  
    const tarea = tareas[0];
  
    const comentariosSql = `
      SELECT c.id, c.contenido, c.fecha_comentario,
              u.id AS usuario_id, u.nombre AS usuario_nombre
      FROM comentarios c
      INNER JOIN usuarios u ON u.id = c.id_usuario
      WHERE c.id_tarea = $1
      ORDER BY c.fecha_comentario ASC
    `;
  
    const comentariosRows = await this.db.query(comentariosSql, [id]);
  
    const comentarios = comentariosRows.map(c => ({
      id: c.id,
      contenido: c.contenido,
      fecha_comentario: c.fecha_comentario,
      usuario: {
        id: c.usuario_id,
        nombre: c.usuario_nombre,
      },
    }));
  
    const categoriasSql = `
      SELECT cat.id, cat.nombre, cat.color
      FROM categorias cat
      INNER JOIN tarea_posee_categoria tpc
        ON tpc.id_categoria = cat.id
      WHERE tpc.id_tarea = $1
    `;
  
    const categorias = await this.db.query(categoriasSql, [id]);
  
    return {
      ...tarea,
      comentarios,
      categorias,
    };
  }

  async findAll(usuario?: number, estado?: string) {
    let sql = `
      SELECT DISTINCT t.id, t.titulo, t.descripcion, t.story_points,
              t.fecha_entrega, t.estado, t.id_creador, t.fecha_creacion
      FROM tareas t
      LEFT JOIN tarea_asigna_usuario tau ON t.id = tau.id_tarea
    `;
  
    const conditions: string[] = [];
    const values: any[] = [];
  
    if (usuario) {
      values.push(usuario);
      conditions.push(`tau.id_usuario = $${values.length}`);
    }
  
    if (estado) {
      values.push(estado);
      conditions.push(`t.estado = $${values.length}`);
    }
  
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
  
    return this.db.query(sql, values);
  }
  
  async create(dto: CrearTareaDTO, idCreador: number) {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');
      const sqlTarea = `
        INSERT INTO tareas (
          id,
          titulo,
          descripcion,
          story_points,
          fecha_entrega,
          id_creador
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const tareaResult = await client.query(sqlTarea, [
        dto.id,
        dto.titulo,
        dto.descripcion ?? null,
        dto.story_points ?? null,
        dto.fecha_entrega ?? null,
        idCreador,
      ]);

      const tarea = tareaResult.rows[0];
      const sqlAsignar = `
        INSERT INTO tarea_asigna_usuario (id_tarea, id_usuario)
        VALUES ($1, $2)
      `;

      await client.query(sqlAsignar, [
        tarea.id,
        dto.id_usuario_asignado,
      ]);

      if (dto.categorias?.length) {
        const sqlCategoria = `
          INSERT INTO tarea_posee_categoria (id_tarea, id_categoria)
          VALUES ($1, $2)
        `;

        for (const idCategoria of dto.categorias) {
          await client.query(sqlCategoria, [
            tarea.id,
            idCategoria,
          ]);
        }
      }

      await client.query('COMMIT');

      return {
        ...tarea,
        usuario_asignado: dto.id_usuario_asignado,
        categorias: dto.categorias ?? [],
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // tareas.service.ts De momento no se utiliza
  async findByUsuario(idUsuario: number) {
      const sql = `
          SELECT t.* FROM tareas t
          INNER JOIN tarea_asigna_usuario tau ON t.id = tau.id_tarea
          WHERE tau.id_usuario = $1`;
      return this.db.query(sql, [idUsuario]);
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
