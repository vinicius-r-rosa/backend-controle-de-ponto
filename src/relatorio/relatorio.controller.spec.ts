import { Test, TestingModule } from '@nestjs/testing';
import { RelatorioController } from './relatorio.controller';
import { RelatorioService } from './relatorio.service';

describe('RelatorioController', () => {
  let relatorioController: RelatorioController;
  let relatorioService: RelatorioService;

  const mockRelatorios = [
    {
      anoMes: '2018-08',
      horasTrabalhadas: 'PT8H0M',
      horasExcedentes: 'PT0S',
      horasDevidas: 'PT176H0M',
      expedientes: [
        {
          dia: '2018-08-31',
          pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'],
        },
      ],
    },
    {
      anoMes: '2018-09',
      horasTrabalhadas: 'PT8H0M',
      horasExcedentes: 'PT0S',
      horasDevidas: 'PT176H0M',
      expedientes: [
        {
          dia: '2018-09-30',
          pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'],
        },
      ],
    },
  ];

  const mockRelatorio = mockRelatorios[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatorioController],
      providers: [
        {
          provide: RelatorioService,
          useValue: {
            gerarRelatorios: jest.fn().mockResolvedValue(mockRelatorios),
            gerarRelatorio: jest.fn().mockResolvedValue(mockRelatorio),
          },
        },
      ],
    }).compile();

    relatorioController = module.get<RelatorioController>(RelatorioController);
    relatorioService = module.get<RelatorioService>(RelatorioService);
  });

  it('should be defined', () => {
    expect(relatorioController).toBeDefined();
  });

  describe('gerarRelatorios', () => {
    it('should return all reports', async () => {
      // É necessário Mockar o BD para que não dê erro?
      const result = await relatorioController.gerarRelatorios();
      expect(result).toEqual(mockRelatorios);
      expect(relatorioService.gerarRelatorios).toHaveBeenCalled();
    });
  });

  describe('gerarRelatorio', () => {
    it('should return a specific report', async () => {
      const anoMes = '2018-08';
      // É necessário Mockar o BD para que não dê erro?
      const result = await relatorioController.gerarRelatorio(anoMes);
      expect(result).toEqual(mockRelatorio);
      expect(relatorioService.gerarRelatorio).toHaveBeenCalledWith(anoMes);
    });
  });
});
