import { Test, TestingModule } from '@nestjs/testing';
import { ExpedienteDto } from '../expediente/expediente.dto';
import { BatidaController } from './batida.controller';
import { BatidaDto } from './batida.dto';
import { BatidaService } from './batida.service';

describe('BatidaController', () => {
  let batidaController: BatidaController;
  let batidaService: BatidaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatidaController],
      providers: [
        {
          provide: BatidaService,
          useValue: {
            registrarBatida: jest.fn(),
            deletarBatidas: jest.fn(),
          },
        },
      ],
    }).compile();

    batidaController = module.get<BatidaController>(BatidaController);
    batidaService = module.get<BatidaService>(BatidaService);
  });

  describe('registrarBatida', () => {
    it('should call registrarBatida method of BatidaService with correct parameters', async () => {
      const batidaDto: BatidaDto = {
        momento: new Date('2018-08-03T08:00:00'),
      };
      const result: ExpedienteDto = {
        dia: '2018-08-03',
        pontos: ['08:00'],
      };
      jest.spyOn(batidaService, 'registrarBatida').mockResolvedValue(result);

      expect(await batidaController.registrarBatida(batidaDto)).toBe(result);
      expect(batidaService.registrarBatida).toHaveBeenCalledWith(batidaDto);
    });
  });

  describe('deletarBatidas', () => {
    it('should call deletarBatidas method of BatidaService', async () => {
      await batidaController.deletarBatidas();
      expect(batidaService.deletarBatidas).toHaveBeenCalled();
    });
  });
});
