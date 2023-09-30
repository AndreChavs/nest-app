/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class AtualizarJogadorDto {
  @IsNotEmpty()
  telefone: string;

  @IsNotEmpty()
  nome: string;
}