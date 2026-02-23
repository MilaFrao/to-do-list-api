import { MaxLength, IsEmail, IsString, IsNotEmpty, isInt, IsInt, IsOptional, IsArray, IsNumber} from "class-validator";

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

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    id_usuario_asignado: number[];

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    categorias?: number[];
}