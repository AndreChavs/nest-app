/* eslint-disable prettier/prettier */
 import { Document } from "mongoose";

export interface Jogador extends Document { 
  readonly telefone: string;
  readonly email: string;
  nome: string;
  ranking: number;
  posicaoRanking: string;
  urlFotoJogador: string;
}
