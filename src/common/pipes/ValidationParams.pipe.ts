/* eslint-disable prettier/prettier */
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ValidationParamsPipe implements PipeTransform {
 transform(value: any, metadata: ArgumentMetadata) {
   console.log(`value: ${value}; metadata: ${metadata.data}`)
   if(!value){
    throw new BadRequestException(`O valor do parametro ${metadata.data} deve ser informado `)
   }
   return value
 } 

}