import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CompanyDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name: string;
}
