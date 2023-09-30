/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from '../categorias/categorias.module';
import { JogadoresModule } from '../jogadores/jogadores.module';
import { DesafioController } from './desafio.controller';
import { DesafioService } from './desafio.service';
import { DesafioSchema } from './interfaces/desafio.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {name: 'Desafio', schema: DesafioSchema}
  ]),JogadoresModule, CategoriasModule],
  controllers:[DesafioController],
  providers:[DesafioService]

})
export class DesafioModule {}
