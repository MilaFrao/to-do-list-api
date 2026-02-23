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

    // Nuevo: Obtener usuarios asignados a la tarea
    const tarea = tareas[0];
    const asignadosSql = `
    SELECT u.id, u.nombre 
    FROM usuarios u
    INNER JOIN tarea_asigna_usuario tau ON tau.id_usuario = u.id
    WHERE tau.id_tarea = $1
  `;
  const asignados = await this.db.query(asignadosSql, [idTarea]);
    
    const comentariosSql = 'SELECT c.id, c.contenido, c.fecha_comentario, u.id AS usuario_id, u.nombre AS usuario_nombre FROM comentarios c JOIN usuarios u ON u.id = c.id_usuario WHERE c.id_tarea = $1 ORDER BY c.fecha_comentario ASC';
    const comentarios = await this.db.query(comentariosSql,[idTarea]);

    const categoriasSql = 'SELECT cat.id, cat.nombre, cat.color FROM categorias cat JOIN tarea_posee_categoria tpc ON tpc.id_categoria = cat.id WHERE tpc.id_tarea = $1';
    const categorias = await this.db.query(categoriasSql,[idTarea]);

    return {
      ...tarea,
      asignados, // Devolvemos el arreglo completo de usuarios asignados
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
    const conditions: string[] = [];
    const values: any[] = [];

    if (estado) {
      values.push(estado);
      conditions.push(`t.estado = $${values.length}`);
    }

    if (usuario) {
      values.push(usuario);
      // Filtramos por tareas creadas por el usuario o asignadas al usuario
      conditions.push(`(t.id_creador = $${values.length} OR EXISTS (SELECT 1 FROM tarea_asigna_usuario tau2 WHERE tau2.id_tarea = t.id AND tau2.id_usuario = $${values.length}))`);
    }

    let sql = `
      SELECT t.id, t.titulo, t.descripcion, t.story_points,
              t.fecha_entrega, t.estado, t.id_creador, t.fecha_creacion,
              (SELECT COALESCE(array_agg(tau2.id_usuario), ARRAY[]::integer[]) FROM tarea_asigna_usuario tau2 WHERE tau2.id_tarea = t.id) AS usuarios_asignados,
              (SELECT COALESCE(json_agg(json_build_object('id', cat.id, 'nombre', cat.nombre, 'color', cat.color)), '[]'::json)
              FROM tarea_posee_categoria tpc JOIN categorias cat ON cat.id = tpc.id_categoria
              WHERE tpc.id_tarea = t.id) AS categorias
      FROM tareas t
    `;

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    return this.db.query(sql, values);
  }
  
  async create(dto: CrearTareaDTO, idCreador: number) {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');
      
      // 1. Insertar la tarea (se mantiene igual)
      const sqlTarea = `INSERT INTO tareas (id, titulo, descripcion, story_points, fecha_entrega, id_creador)
                        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const tareaResult = await client.query(sqlTarea, [
        dto.id, dto.titulo, dto.descripcion ?? null,
        dto.story_points ?? null, dto.fecha_entrega ?? null, idCreador,
      ]);
      const tarea = tareaResult.rows[0];
  
      // 2. NUEVO: Insertar MÚLTIPLES asignados
      if (dto.id_usuario_asignado?.length) {
        const sqlAsignar = `INSERT INTO tarea_asigna_usuario (id_tarea, id_usuario) VALUES ($1, $2)`;
        for (const idUsuario of dto.id_usuario_asignado) {
          await client.query(sqlAsignar, [tarea.id, idUsuario]);
        }
      }
  
      // 3. Insertar categorías (se mantiene igual)
      if (dto.categorias?.length) {
        const sqlCategoria = `INSERT INTO tarea_posee_categoria (id_tarea, id_categoria) VALUES ($1, $2)`;
        for (const idCategoria of dto.categorias) {
          await client.query(sqlCategoria, [tarea.id, idCategoria]);
        }
      }
  
      await client.query('COMMIT');
      return {
        ...tarea,
        usuarios_asignados: dto.id_usuario_asignado ?? [], // Devolvemos el arreglo completo
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
      SELECT t.id, t.titulo, t.descripcion, t.story_points,
              t.fecha_entrega, t.estado, t.id_creador, t.fecha_creacion,
              (SELECT COALESCE(array_agg(tau2.id_usuario), ARRAY[]::integer[]) FROM tarea_asigna_usuario tau2 WHERE tau2.id_tarea = t.id) AS usuarios_asignados,
              (SELECT COALESCE(json_agg(json_build_object('id', cat.id, 'nombre', cat.nombre, 'color', cat.color)), '[]'::json)
              FROM tarea_posee_categoria tpc JOIN categorias cat ON cat.id = tpc.id_categoria
              WHERE tpc.id_tarea = t.id) AS categorias
      FROM tareas t
      WHERE t.id_creador = $1 OR EXISTS (
        SELECT 1 FROM tarea_asigna_usuario tau2 WHERE tau2.id_tarea = t.id AND tau2.id_usuario = $1
      )
    `;

    return this.db.query(sql, [idUsuario]);
  }

  //Cristian: Update modificado para actualizar
  // los datos básicos de la tarea, eliminar las categorías viejas y agregar las nuevas
  async update(id: number, dto: ActualizarTareaDTO) {
    const client = await this.db.getClient();
  
    try {
      await client.query('BEGIN');
  
      // 1. Actualizamos la tarea (los campos básicos)
      const sqlTarea = `
        UPDATE tareas 
        SET titulo = $1, descripcion = $2, estado = $3 
        WHERE id = $4 
        RETURNING *`;
      
      const resTarea = await client.query(sqlTarea, [
        dto.titulo,
        dto.descripcion,
        dto.estado,
        id
      ]);
  
      // 2. Limpiamos y actualizamos las categorías en la tabla intermedia
      await client.query('DELETE FROM tarea_posee_categoria WHERE id_tarea = $1', [id]);
  
      if (dto.categorias && dto.categorias.length > 0) {
        const sqlCategorias = `
          INSERT INTO tarea_posee_categoria (id_tarea, id_categoria)
          SELECT $1, unnest($2::int[])`;
        
        await client.query(sqlCategorias, [id, dto.categorias]);
      }
  
      await client.query('COMMIT');
  
      // Construimos la respuesta final combinando los datos de la tarea con los del DTO
      const tareaActualizada = {
        ...resTarea.rows[0],       // Trae id, titulo, descripcion, estado, etc.
        categorias: dto.categorias // Agregamos el array de IDs que acabamos de guardar
      };
  
      return tareaActualizada; // Ahora Postman mostrará las categorías
  
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  //Cristian: Delete modificado para eliminar la tarea
  // y que la DB se encargue de eliminar los registros relacionados por el CASCADE
  async delete(id: number) {
    try {
      //Solo necesitamos borrar la tarea, la DB borrará el resto por el CASCADE
      const sql = 'DELETE FROM tareas WHERE id = $1 RETURNING id';
      const result = await this.db.query(sql, [id]);
  
      // Si el array está vacío, significa que el ID no existía
      if (result.length === 0) {
        throw new NotFoundException(`La tarea con ID ${id} no existe`);
      }
  
      return {
        message: 'Tarea y sus registros asociados eliminados correctamente',
        id: result[0].id,
      };
    } catch (error) {
      // Si lanzaste manualmente el NotFoundException, lo dejamos pasar
      if (error instanceof NotFoundException) {
        throw error;
      }
  
      // Cualquier otro error (conexión, sintaxis, etc.)
      throw new InternalServerErrorException('Error al intentar eliminar la tarea');
    }
  }

}
