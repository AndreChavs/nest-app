/* eslint-disable prettier/prettier */
import { CarroFile } from "../interfaces/carro.interface";

export class CreateCar {
  public _id: string; //Alguns DB's geram automaticamente
  public marca: string;
  public modelo: string;
  public ano: string;
  public fileImage: CarroFile; 
}

export class UpdadeCar {
  public _id: string
  public marca: string;
  public modelo: string;
  public ano: string;
  public fileImage: CarroFile;
}
