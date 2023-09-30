/* eslint-disable prettier/prettier */
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { Jogador } from "src/modules/jogadores/interfaces/jogador.interface";


export class AlterarDesafioDto{

  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  jogadores: Jogador[]
}