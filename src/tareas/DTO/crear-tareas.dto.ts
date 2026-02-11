import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';


export class CrearTareaDTO {

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  titulo?: string;

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
  fecha_entrega?: string; 

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  id_creador?: number;

}
