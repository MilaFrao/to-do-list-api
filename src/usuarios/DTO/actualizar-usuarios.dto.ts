import { IsEmail, IsNotEmpty, isNotEmpty, IsString, MaxLength } from "class-validator";

export class ActualizarUsuarioDTO {
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
    contrasena!: string;
}