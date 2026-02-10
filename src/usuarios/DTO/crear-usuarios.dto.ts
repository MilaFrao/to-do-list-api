import { IsEmail, IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class CrearUsuarioDTO {

    @IsNotEmpty()
    @IsInt()
    @Type(()=> Number)
    id?: number;


    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    nombre?: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    @MaxLength(150)
    email?: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    contrasena?: string;
}