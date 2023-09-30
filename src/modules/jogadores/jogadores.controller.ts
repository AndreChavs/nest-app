/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogador } from './interfaces/jogador.interface';
import { AtualizarJogadorDto } from './dto/atualizarJogador.dto';
import { ValidationParamsPipe } from 'src/common/pipes/ValidationParams.pipe';


/* 
Semelhante ao Next.js - O Controller Faz o papel da API 
 *O Controller indica a rota referênte a API
 * É injetado as dependencias dos serviços no contrutor da classe Controller
 * 
*/


@Controller('/api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService){}
  
  @Get()
  public async ConsultarJogadores(): Promise<Jogador[]>{
    return await this.jogadoresService.consultarTodosJogadores()
  }
  
  @Get('/:_id')
  public async ConsultarJogadorPeloId(
    @Param('_id', ValidationParamsPipe) _id: string
  ):Promise<Jogador>{
    return this.jogadoresService.consultarJogadorPeloId(_id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async CreatePlayer(
    @Body() CriarJogadorDto: CriarJogadorDto
    ): Promise<Jogador> {
    return await this.jogadoresService.CreatePlayer(CriarJogadorDto)      
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  public async UpdadePlayer(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidationParamsPipe) _id:string
    ):Promise<Jogador> {
    return await this.jogadoresService.UpdatePlayer(_id, atualizarJogadorDto)      
  }

  @Delete('/:_id')
  public async DeletarJogador(
    @Param('_id', ValidationParamsPipe) _id: string
  ):Promise<Jogador>{
    return await this.jogadoresService.deletarJogador(_id)
  }
}

