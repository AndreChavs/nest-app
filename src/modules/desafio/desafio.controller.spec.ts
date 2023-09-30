import { Test, TestingModule } from '@nestjs/testing';
import { DesafioController } from './desafio.controller';

describe('DesafioController', () => {
  let controller: DesafioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesafioController],
    }).compile();

    controller = module.get<DesafioController>(DesafioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
