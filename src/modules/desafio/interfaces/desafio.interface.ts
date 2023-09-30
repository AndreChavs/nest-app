/* eslint-disable prettier/prettier */
import { Jogador } from "src/modules/jogadores/interfaces/jogador.interface";

export interface Desafio extends Document{
  dataHoraDesafio: Date;
  status: 'PENDENTE' | 'REALIZADO' | 'ACEITO' | 'NEGADO' | 'CANCELADO';
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: string;
  categoria: string;
  jogadores: Jogador[]
  partida: Partida
}

export interface Partida extends Document{
  categoria: string;
  jogadores: Jogador[];
  def: Jogador;
  resultado: Resultado[];
}

export interface Resultado{
  set: string
}

export enum DesafioStatus {
  REALIZADO = "REALIZADO",
  PENDENTE = "PENDENTE",
  ACEITO = "ACEITO",
  NEGADO = "NEGADO",
  CANCELADO = "CANCELADO"
}