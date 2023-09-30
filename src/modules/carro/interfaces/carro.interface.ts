export interface Carro {
  _id: string;
  marca: string;
  modelo: string;
  ano: string;
  urlImage?: string;
  fileImage: CarroFile;
}

export type CarroFile = {
  base64Data: string;
  dataFile: {
    type: string;
    name: string;
  };
};
