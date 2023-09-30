/* eslint-disable prettier/prettier */
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";


export class ValidationIdJogador implements PipeTransform{
  transform(value: {categoria: string, idJogador: string}, metadata: ArgumentMetadata) {

    console.log(value.idJogador)
    function validarIdObject(idValue:any) {
      return idValue instanceof Types.ObjectId
    }
    const isValidObjectId = Types.ObjectId.isValid(value.idJogador);
    
    if(!validarIdObject(value.idJogador) && !isValidObjectId) throw new BadRequestException(`O id ${value.idJogador} é invalido`)

    return value
  }
}