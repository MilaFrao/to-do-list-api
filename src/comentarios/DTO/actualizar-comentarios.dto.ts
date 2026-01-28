import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ActualizarComentarioDTO {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    contenido?: string;
}
