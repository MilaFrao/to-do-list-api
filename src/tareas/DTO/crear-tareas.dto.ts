import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';


export class CrearTareaDTO {

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  story_points?: number;

  @IsOptional()
  @IsDateString()
  fecha_entrega?: string; // ISO string 'YYYY-MM-DD' o 'YYYY-MM-DDTHH:MM:SSZ'

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_creador: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_asignado?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_categorias?: number;
}
