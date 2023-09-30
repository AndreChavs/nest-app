/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { CategoriasService } from '../categorias/categorias.service';
import { JogadoresService } from '../jogadores/jogadores.service';
import { AlterarDesafioDto } from './dtos/alterarDesafioDto.dto';
import { AtribuirDesafioPartidaDto } from './dtos/atribuirDesafioPartidaDto.dto';
import { AtualizarDesafioDto } from './dtos/atualizarDesafioDto.dto';
import { CriarDesafioDto } from './dtos/criarDesafios.dto';
import { Desafio, DesafioStatus, Partida } from './interfaces/desafio.interface';

interface DesafioCriado extends Desafio {  
  categoria: string;
}


@Injectable()
export class DesafioService {

  private desafioCriado: Document<unknown, any, DesafioCriado> & Omit<DesafioCriado & {
    _id: Types.ObjectId;
  }, never>;

  private logger = new Logger();

  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<DesafioCriado>,
    @InjectModel('Partida') private readonly partidaModel:Model<Partida>,
    private readonly jogadoresService:JogadoresService,
    private readonly categoriasService: CategoriasService
    ){}

  public async findAll():Promise<Desafio[]>{
    return await this.desafioModel.find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec()
  }

  public async findById(id:string):Promise<Desafio>{
    const findDesafio = await this.desafioModel.findById(id).exec()

    if(!findDesafio) throw new BadRequestException(`Desafio não encontrado`)

    return findDesafio
  }

  public async createDesafio(criarDesafioDto: CriarDesafioDto):Promise<Desafio>{  
    //verifica se os jogadores ja foram cadastrados anteriormente
    const jogadores = await this.jogadoresService.consultarTodosJogadores();  
    criarDesafioDto.jogadores.map((jogadorDto) => {     
      const jogadorFilter = jogadores.filter( (jogador) => {        
        return jogador.id === jogadorDto._id
      });      
      if(jogadorFilter.length == 0){
        throw new BadRequestException(`O id ${jogadorDto._id} não é um jogador`)
      }
    })

    //verifica se o solicitante é um dos jogadores da partida
    const solicitanteEhJogadorDaPartida = criarDesafioDto.jogadores.filter((jogador) => {
      return jogador._id === criarDesafioDto.solicitante._id
    });   
    
    if(solicitanteEhJogadorDaPartida.length == 0){
      throw new BadRequestException(`O solicitante deve ser um jogador da partida`)
    }

    //verificar a categoria do jogador solicitante    
    const categoriaDoJogador = await this.categoriasService.consultarCategoriaDoJogador(criarDesafioDto.solicitante._id);
    
    if(!categoriaDoJogador){
      throw new BadRequestException(`O solicitante ${criarDesafioDto.solicitante} precisa estar cadastrado em uma categoria`)
    }

    this.desafioCriado = new this.desafioModel(criarDesafioDto)
    this.desafioCriado.categoria = categoriaDoJogador.categoria;
    this.desafioCriado.dataHoraSolicitacao = new Date();
    this.logger.log(`DesafioCriado.dataHoraSolicitacao = ${this.desafioCriado.dataHoraSolicitacao} `)
    this.desafioCriado.status = DesafioStatus.PENDENTE
    return await this.desafioCriado.save()
  }

  public async consultarDesafiosDeUmJogador(idJogador:any):Promise<Desafio[]>{
    //verificar se o jogador existe
    await this.jogadoresService.consultarJogadorPeloId(idJogador)
   
    return await this.desafioModel.find()
    .where('jogadores')
    .in(idJogador)
    .populate('solicitante')
    .populate('jogadores')
    .populate('partida')
    .exec()
  }

  public async atualizarDesafio(desafioId: string, atualizarDesafio:AtualizarDesafioDto):Promise<void>{
    const findDesafio = await this.desafioModel.findById(desafioId).exec()

    if(!findDesafio){
      throw new NotFoundException(`Desafio ${desafioId} não encontrado`)
    }

    findDesafio.status = atualizarDesafio.status
    findDesafio.dataHoraDesafio = atualizarDesafio.dataHoraDesafio
    return 
  }

  public async atribuirDesafioPartida(desafioId: string, dto: AtribuirDesafioPartidaDto):Promise<void>{
    const findDesafio = await this.desafioModel.findById(desafioId).exec()

    if(!findDesafio) throw new BadRequestException(`Desafio não encontrado`)

    //verificar se o jogador vencedor faz parte do desafio
    const jogadorFilter = findDesafio.jogadores.filter((jogador) => jogador._id == dto.def)

    this.logger.log(`desafioEncontrado: ${findDesafio}`);
    this.logger.log(`jogadorFilter: ${jogadorFilter}`);

    if(jogadorFilter.length === 0){
      throw new BadRequestException(`O jogador vencedor não faz parte do desafio`);      
    }

    //Criar e persistir o objeto da parttida
    const partidaCriada = new this.partidaModel(dto)
    partidaCriada.categoria = findDesafio.categoria

    partidaCriada.jogadores = findDesafio.jogadores
    const resultado = await partidaCriada.save()

    /*
        Quando uma partida for registrada por um usuário, mudaremos o 
        status do desafio para realizado
    */
    findDesafio.status = DesafioStatus.REALIZADO

    findDesafio.partida = resultado.id
    try {
      await this.desafioModel.findOneAndUpdate({desafioId},{$set: findDesafio}).exec()
    } catch (error) {
      /*
        Se a atualização do desafio falhar excluímos a partida 
        gravada anteriormente
      */
      await this.partidaModel.deleteOne({_id: resultado.id}).exec();
      throw new InternalServerErrorException() 
    }    
  }
  async deletarDesafio(_id:string):Promise<void>{
    const findDesafio = await this.desafioModel.findById(_id).exec()
    if(!findDesafio){
      throw new BadRequestException(`Desafio id: ${_id} não encontrado`)
    }
    findDesafio.status = DesafioStatus.CANCELADO
    await this.desafioModel.findOneAndUpdate({_id},{$set: findDesafio}).exec()
  }
}
