/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CarroService } from './carro.service';
import { CreateCar, UpdadeCar } from './dto/carro.dto';

@Controller('/api/v1/carro')
export class CarroController {

  constructor(private readonly carroService: CarroService){}

  @Get('/:id')
  public async GetThisCar(
    @Param('id') id:string
  ){    
    return this.carroService.GetThisCar(id)
  }

  @Get()
  public async GetAllCars(){
    return this.carroService.GetAllCars()
  }

  @Post()
  public async PostCar(
    @Body() createCar: CreateCar 
  ){
    return this.carroService.CreateCar(createCar)
  }

  @Put()
  public async UpdateCar(
    @Body() updateCar: UpdadeCar
  ){
    return this.carroService.UpdateCar(updateCar)
  }

  @Delete()
  public async DeleteCar(
    @Body() id: string
  ){
    return this.carroService.DeleteCar(id)
  }
}
