/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categoria.interface';
import mongoose, { Model } from 'mongoose';
import { CriarCategoriaDto } from './dto/criarCategoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizarCategoria.dto';
import { JogadoresService } from 'src/modules/jogadores/jogadores.service';
import { CriarDesafioDto } from '../desafio/dtos/criarDesafios.dto';



@Injectable()
export class CategoriasService {

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel:Model<Categoria>,
    private readonly jogadoresService: JogadoresService
  ){}
    
  public async consultarCategorias():Promise<Categoria[]>{
    return await this.categoriaModel.find().exec()
  }
    
  public async consultarCategoria(categoria:string):Promise<Categoria>{   
    const findCategoria = await this.categoriaModel.findOne({categoria}).exec()        
    if(!findCategoria) throw new NotFoundException()   
    return findCategoria
  }

  public async consultarCategoriaDoJogador(idJogador: string):Promise<Categoria>{
    const findCategoria = await this.categoriaModel.findOne({jogadores: idJogador}).exec()
    
    if(!findCategoria) throw new BadRequestException(`Não foi possível encontrar a categoria do jogador`)

    return findCategoria
  }

  public async createCategoria(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria>{
    return await this.categoriaModel.create(criarCategoriaDto)
  }
    
  public async alterarCategoria(atualizarCategoriaDto: AtualizarCategoriaDto, categoria: string):Promise<Categoria>{
    //verifica se existe e atualiza
    const alterarCategoria = await this.categoriaModel.findOneAndUpdate({categoria},atualizarCategoriaDto).exec()

    //se a categoria não existe, então
    if(!alterarCategoria) throw new NotFoundException(`A categoria ${categoria} não foi encontrada`)

    return alterarCategoria
  }

  public async atribuirJogador(categoria: string, idJogador: string){
    const findCategoria = await this.categoriaModel.findOne({categoria}).exec()
    const findJogador = await this.jogadoresService.consultarJogadorPeloId(idJogador)
    const jogadorCadastradoCategoria = findCategoria?.jogadores.find((item) => {
      const valueStringfy = JSON.stringify(item)
      return JSON.parse(valueStringfy) === idJogador
    })

    if(!findCategoria) throw new NotFoundException(`A categoria ${categoria} não foi encontrada`)
    
    if(!findJogador) throw new NotFoundException(`O Jogador ${idJogador} não foi encontrado`)
    
    if(jogadorCadastradoCategoria) throw new BadRequestException(`O jogador com id ${idJogador} já existe`)    

    findCategoria?.jogadores.push(findJogador)
    return await findCategoria.save()
  }

  public async excluirJogadorAtribuido(categoria: string, idJogador: string){
    const findCategoria = await this.categoriaModel.findOne({categoria}).exec()
    const findJogador = await this.jogadoresService.consultarJogadorPeloId(idJogador)
    const findJogadorAtribuido = findCategoria?.jogadores.find((item) => {
      const valueStringfy = JSON.stringify(item)      
      return JSON.parse(valueStringfy) === idJogador
    })
    
    if(!findCategoria) throw new NotFoundException(`Categoria ${categoria} Não encontrada`)
    
    if(!findJogador) throw new NotFoundException(`Jogador ${findJogador.nome} não encontrato`)
    
    if(!findJogadorAtribuido) throw new NotFoundException(`Jogador ${findJogador.nome} não encontrado na categoria`)

    const excluirJogador = findCategoria?.jogadores.filter((item) => {
      const valueStringfy = JSON.stringify(item)      
      return JSON.parse(valueStringfy) !== idJogador
    })

    findCategoria.jogadores = excluirJogador
    
    return await findCategoria.save()
  }

  public async excluirCategoria(categoria: string): Promise<Categoria>{
    const findCategoria = await this.categoriaModel.findOneAndDelete({categoria})

    if(!findCategoria) throw new NotFoundException(`Categoria ${categoria} não encontrada`)

    return findCategoria
  }
}
