/* eslint-disable prettier/prettier */

import { IsDateString, IsNotEmpty } from "class-validator";


export class AtualizarDesafioDto {

  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsNotEmpty()
  status: 'PENDENTE' | 'REALIZADO' | 'ACEITO' | 'NEGADO' | 'CANCELADO';
}