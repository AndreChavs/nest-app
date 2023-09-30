/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CarroController } from './carro.controller';
import { CarroService } from './carro.service';

@Module({
  controllers:[CarroController],
  providers:[CarroService]
})
export class CarroModule {}
