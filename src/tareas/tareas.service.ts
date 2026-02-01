import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CrearTareaDTO } from './DTO/crear-tareas.dto';
import { DbService } from 'src/db/db.service';
import { ActualizarTareaDTO } from './DTO/actualizar-tareas.dto';

@Injectable()
export class TareasService {
  constructor(private readonly db: DbService) {}

  async findAll() {
    const sql = `
      SELECT id, titulo, descripcion, story_points, fecha_entrega, estado, id_creador, id_asignado, id_categorias, fecha_creacion
      FROM tareas`;
    try {
      const rows = await this.db.query(sql);
      return rows; // db.query devuelve array de rows
    } catch (err) {
      // log si tienes logger
      throw new InternalServerErrorException('Error obteniendo tareas');
    }
  }

  async create(dto: CrearTareaDTO) {
    const sql = `
      INSERT INTO tareas (
        titulo,
        descripcion,
        story_points,
        fecha_entrega,
        id_creador,
        id_asignado,
        id_categorias
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      dto.titulo,
      dto.descripcion ?? null,
      dto.story_points ?? null,
      dto.fecha_entrega ?? null,
      dto.id_creador,
      dto.id_asignado ?? null,
      dto.id_categorias ?? null,
    ];

    try {
      const rows = await this.db.query(sql, values);
      // rows es array; retornamos el primer registro insertado
      return rows[0];
    } catch (err: any) {
      // Manejo básico de errores Postgres por código
      // 23503 = foreign_key_violation, 23505 = unique_violation, 23514 = check_violation
      if (err.code === '23503') {
        throw new BadRequestException('Valor de clave foránea no existe (usuario o categoría)');
      }
      if (err.code === '23514') {
        throw new BadRequestException('Violación de restricción CHECK (p. ej. story_points debe ser >= 0)');
      }
      // opcional para unique:
      if (err.code === '23505') {
        throw new BadRequestException('Violación de unique constraint');
      }
      throw new InternalServerErrorException('Error creando tarea');
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
