/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { DesafioService } from './desafio.service';

describe('DesafioService', () => {
  let service: DesafioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesafioService],
    }).compile();

    service = module.get<DesafioService>(DesafioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
