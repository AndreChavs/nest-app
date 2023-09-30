/* eslint-disable prettier/prettier */
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";

export class Validation2IdJogador implements PipeTransform{
  transform(value: string, metadata: ArgumentMetadata) {

    function validarIdObject(idValue: any): boolean {
      return idValue instanceof Types.ObjectId
    }
    const isValidObjectId = Types.ObjectId.isValid(value)

    //testando as validações
    if(!validarIdObject(value) && !isValidObjectId){
      throw new BadRequestException(`O id ${value} é invalido`)
    }

    return value

  }
}