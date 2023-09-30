/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dto/atualizarJogador.dto';

@Injectable()
export class JogadoresService {
  
  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>){}
 
  public async CreatePlayer(CriarJogadorDto:CriarJogadorDto):Promise<Jogador> {
    
    this.verifyEmailAndTelefone(CriarJogadorDto)
    return await this.jogadorModel.create(CriarJogadorDto)    
  }

  public async UpdatePlayer(_id: string ,atualizarJogadorDto: AtualizarJogadorDto):Promise<Jogador>{
    const jogadorFind = await this.jogadorModel.findById(_id).exec()    
    if(!jogadorFind){
      throw new NotFoundException(`Jogador ${_id} não encontrado`)
    }        
    return await this.jogadorModel.findByIdAndUpdate(_id, atualizarJogadorDto).exec()
  }
   
  public async consultarTodosJogadores(): Promise<Jogador[]>{
    return await this.jogadorModel.find().exec()
  }

  public async consultarJogadorPeloId(_id:string){
    const jogadorEncontrado = await this.jogadorModel.findById(_id).exec()
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador ${_id} não encontrado`)
    } else {
      return jogadorEncontrado
    }
  }

  public async deletarJogador(_id: string):Promise<Jogador>{
    const jogador = await this.jogadorModel.findByIdAndDelete(_id).exec()
    if(!jogador){
      throw new NotFoundException(`Jogador ${_id} Não foi Deletado`)
    }else {
      return jogador
    }
  }

  private async verifyEmailAndTelefone(CriarJogadorDto:CriarJogadorDto){    
    const {email, telefone} = CriarJogadorDto
    const findTelefone = await this.jogadorModel.findOne({telefone}).exec()    
    const findEmail = await this.jogadorModel.findOne({email}).exec()
    if(findTelefone){
      throw new BadRequestException(`O Número ${telefone} Telefone já existe`)
    }
    if(findEmail){
      throw new BadRequestException(`O email ${email} já existe`)
    }
  }

}
