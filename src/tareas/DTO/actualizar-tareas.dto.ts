import { MaxLength, IsEmail, IsString, IsNotEmpty, isInt, IsInt } from "class-validator";

export class ActualizarTareaDTO
{
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    titulo?:string;

    @IsNotEmpty()
    @IsString()
    descripcion?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    estado?: string;
}