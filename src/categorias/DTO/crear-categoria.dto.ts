import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CrearCategoriaDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(300)
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    color: string;
}