/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafioStatusValidacaoPipe } from 'src/common/pipes/DesafioStatusValidacaoPipe.pipe';
import { Validation2IdJogador } from 'src/common/pipes/Validation2IdJogador.pipe';
import { DesafioService } from './desafio.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuirDesafioPartidaDto.dto';
import { AtualizarDesafioDto } from './dtos/atualizarDesafioDto.dto';
import { CriarDesafioDto } from './dtos/criarDesafios.dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('/api/v1/desafio')
export class DesafioController {

  private logger = new Logger(DesafioController.name)

  constructor(private readonly desafioService: DesafioService){}

  @Get()
  public async FindAll():Promise<Desafio[]>{
    return await this.desafioService.findAll()
  }

  @Get('/:desafioId')
  @UsePipes(ValidationPipe)
  public async FindById(
    @Param('id') id:string
  ):Promise<Desafio>{
    return await this.desafioService.findById(id)
  }

  @Get('/jogador/:idJogador')
  @UsePipes(Validation2IdJogador)
  public async FindDesafioByJogador(
    @Param('idJogador') idJogador:string
  ):Promise<Desafio[]>{
    return await this.desafioService.consultarDesafiosDeUmJogador(idJogador)
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async CreateDesafio(
    @Body() criarDesafioDto: CriarDesafioDto
  ):Promise<Desafio>{
    return await this.desafioService.createDesafio(criarDesafioDto)
  }

  @Post('/:desafioId/partida')
  public async AtribuirDesafioPartida(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafioId') desafioId: string
  ):Promise<void>{
    return await this.desafioService.atribuirDesafioPartida(desafioId, atribuirDesafioPartidaDto)
  }

  @Put('/:desafioId')  
  public async AlterarDesafio(
    @Param('desafioId')  desafioId: string,
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto
  ):Promise<void>{
    return await this.desafioService.atualizarDesafio(desafioId, atualizarDesafioDto)
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  public async DeletarDesafio(
    @Param('id') id:string
  ){
    return await this.desafioService.deletarDesafio(id)
  }
}
