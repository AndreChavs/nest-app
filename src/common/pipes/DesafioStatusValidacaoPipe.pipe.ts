/* eslint-disable prettier/prettier */
import { BadRequestException, PipeTransform } from "@nestjs/common";
import { DesafioStatus } from "src/modules/desafio/interfaces/desafio.interface";


export class DesafioStatusValidacaoPipe implements PipeTransform{

  public statusPermitidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO    
  ]

  transform(value: any) {
    const status = value.status.toUpperCase()

    if (!this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} é um status inválido`)
    }

    return value
  }

  private ehStatusValido(status: any){
    const index = this.statusPermitidos.indexOf(status);
    return index !== -1
  }
}