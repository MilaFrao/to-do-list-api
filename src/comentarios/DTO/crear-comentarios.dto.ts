import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearComentarioDTO {

    @IsNotEmpty()
    @IsString()
    contenido: string;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id_usuario: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    id_tarea: number;
}
