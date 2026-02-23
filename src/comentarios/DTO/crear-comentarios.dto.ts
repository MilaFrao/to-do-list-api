import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearComentarioDTO {
    @IsInt()
    @Type(() => Number)
    id!: number;

    @IsNotEmpty()
    @IsString()
    contenido?: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id_tarea?: number;
}
