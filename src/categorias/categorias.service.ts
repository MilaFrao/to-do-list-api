import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CrearCategoriaDTO } from './DTO/crear-categoria.dto';
import { ActualizarCategoriaDTO } from './DTO/actualizar-categoria.dto';

@Injectable()
export class CategoriasService {
    constructor(private readonly db:DbService){}

    async findAll(){
        const sql = 'SELECT id, nombre, descripcion, color FROM categorias';
        return this.db.query(sql);
    }

    async create(dto: CrearCategoriaDTO){
        const sql = 'INSERT INTO comentarios (nombre, descripcion, color) VALUES ($1, $2, $3) RETURNING id, nombre, descripcion, color';

        return this.db.query(sql,[
            dto.nombre,
            dto.descripcion,
            dto.color
        ]);
    }

    async update(id: number, dto: ActualizarCategoriaDTO){
        const sql = 'UPDATE categorias SET nombre = $1, descripcion = $2, color = $3 WHERE id = $4 RETURNING *';

        return this.db.query(sql,[
            dto.nombre,
            dto.descripcion,
            dto.color,
            id
        ]);
    }


}
