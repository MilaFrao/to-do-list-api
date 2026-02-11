import { IsNotEmpty, IsString, MaxLength, IsInt } from "class-validator";

export class CrearCategoriaDTO {

    @IsNotEmpty()
    @IsInt()
    id?: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    nombre?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(300)
    descripcion?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    color?: string;
}