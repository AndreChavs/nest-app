/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './modules/jogadores/jogadores.module';
import { CarroModule } from './modules/carro/carro.module';
import {ConfigModule} from '@nestjs/config'
import { CategoriasModule } from './modules/categorias/categorias.module';
import { DesafioModule } from './modules/desafio/desafio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_ENV),
    JogadoresModule, 
    CarroModule,
    CategoriasModule,
    DesafioModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
