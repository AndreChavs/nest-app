/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';
import { Validation2IdJogador } from 'src/common/pipes/Validation2IdJogador.pipe';
import { ValidationIdJogador } from 'src/common/pipes/ValidationIdJogador.pipe';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dto/atualizarCategoria.dto';
import { CriarCategoriaDto } from './dto/criarCategoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('/api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService){}

  @Get()
  public async ConsultarCategorias():Promise<Categoria[]>{
    return await this.categoriasService.consultarCategorias()
  }

  @Get('/:categoria')
  public async consultarCategoriaPeloId(
    @Param('categoria') categoria: string
  ):Promise<Categoria>{
    try {
      return await this.categoriasService.consultarCategoria(categoria)      
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: `Não foi possível encontrar a Categoria ${categoria}` ,
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }
  }

  @Get('/jogador/:idJogador')
  @UsePipes(Validation2IdJogador)
  public async consultarCategoriaDoJogador(
    @Param('idJogador') idJogador: string
  ){
    return await this.categoriasService.consultarCategoriaDoJogador(idJogador)
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async CriarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto     
  ): Promise<Categoria>{
    try {
      return await this.categoriasService.createCategoria(criarCategoriaDto)      
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: `Não foi possível criar a categoria` ,
      }, HttpStatus.NOT_FOUND, {
        cause: error
      });
    }
  }

  @Post('/:categoria/jogadores/:idJogador')
  @UsePipes(ValidationIdJogador)
  public async AtribuirJogador(
    @Param() params: {categoria: string, idJogador: string}
  ){
    return await this.categoriasService.atribuirJogador(params.categoria, params.idJogador)         
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  public async AlterarCategoria(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria') categoria: string
  ): Promise<Categoria>{
    return this.categoriasService.alterarCategoria(atualizarCategoriaDto, categoria)
  }

  @Delete('/:categoria/jogadores/:idJogador')
  @UsePipes(ValidationIdJogador)
  public async DeletarJogadorCategoria(
    @Param() params: {categoria: string, idJogador: string}
  ){
    return await this.categoriasService.excluirJogadorAtribuido(params.categoria, params.idJogador)
  }

  @Delete("/:categoria")
  public async DeletarCategoria(
    @Param('categoria') categoria: string
  ):Promise<Categoria>{

    return await this.categoriasService.excluirCategoria(categoria)

  }
}
