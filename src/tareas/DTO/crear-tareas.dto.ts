import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';



export class CrearTareaDTO {

  @IsInt()
  @Type(() => Number)
  id!: number; // ID manual (decisión del equipo)

  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  story_points?: number;

  @IsOptional()
  @IsDateString()
  fecha_entrega?: string;

  @IsInt()
  @Type(() => Number)
  id_usuario_asignado!: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categorias?: number[];
}

