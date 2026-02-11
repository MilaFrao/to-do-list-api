import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearComentarioDTO {

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id?: number;

    @IsNotEmpty()
    @IsDateString()
    fecha_creacion?: string;

    @IsNotEmpty()
    @IsString()
    contenido?: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id_usuario?: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id_tarea?: number;
}
