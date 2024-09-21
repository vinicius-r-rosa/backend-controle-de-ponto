import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Batida } from '../batida/batida.schema';
import { RelatorioService } from './relatorio.service';

const mockBatidas: Batida[] = [
  { momento: new Date('2018-08-31T08:00:00') } as Batida,
  { momento: new Date('2018-08-31T12:00:00') } as Batida,
  { momento: new Date('2018-08-31T13:00:00') } as Batida,
  { momento: new Date('2018-08-31T17:00:00') } as Batida,
];

const mockBatidas2: Batida[] = [
  { momento: new Date('2018-09-28T08:00:00') } as Batida,
  { momento: new Date('2018-09-28T12:00:00') } as Batida,
  { momento: new Date('2018-09-28T13:00:00') } as Batida,
  { momento: new Date('2018-09-28T17:00:00') } as Batida,
];

describe('RelatorioService', () => {
  let service: RelatorioService;

  const mockBatidaModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelatorioService,
        {
          provide: getModelToken(Batida.name),
          useValue: mockBatidaModel,
        },
      ],
    }).compile();

    service = module.get<RelatorioService>(RelatorioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('gerarRelatorios', () => {
    it('should generate reports for each month', async () => {
      const batidas = [...mockBatidas, ...mockBatidas2];
      mockBatidaModel.exec.mockResolvedValue(batidas);

      const result = await service.gerarRelatorios();

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.anoMes)).toEqual(['2018-08', '2018-09']);
    });
  });

  describe('gerarRelatorio', () => {
    it('should throw NotFoundException for invalid anoMes', async () => {
      await expect(service.gerarRelatorio('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if no batidas found', async () => {
      mockBatidaModel.exec.mockResolvedValue([]);
      await expect(service.gerarRelatorio('2018-08')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should generate a report for a valid month', async () => {
      const batidas = mockBatidas;
      mockBatidaModel.exec.mockResolvedValue(batidas);

      const result = await service.gerarRelatorio('2018-08');

      expect(result).toMatchObject({
        anoMes: '2018-08',
        horasTrabalhadas: 'PT8H0M',
        horasExcedentes: 'PT0S',
        horasDevidas: 'PT176H0M',
        expedientes: expect.any(Array),
      });
      expect(result.expedientes).toHaveLength(1);
    });
  });

  describe('private methods', () => {
    const batidas = mockBatidas;

    it('should organize expedientes correctly', () => {
      const result = (service as any).organizarExpedientes(batidas);
      expect(result).toEqual([
        {
          dia: '2018-08-31',
          pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'],
        },
      ]);
    });

    it('should calculate hours worked correctly', () => {
      const result = (service as any).calcularHorasTrabalhadas(batidas);
      expect(result).toBe('PT8H0M');
    });

    it('should calculate working days in a month correctly', () => {
      expect((service as any).diasUteisNoMes(2018, 1)).toBe(23); // January 2018 has 23 working days
    });

    it('should calculate excess hours correctly', () => {
      expect((service as any).calcularHorasExcedentes('PT9H0M', 8)).toBe(
        'PT1H0M',
      );
    });

    it('should calculate owed hours correctly', () => {
      expect((service as any).calcularHorasDevidas('PT7H0M', 8)).toBe('PT1H0M');
    });

    it('should parse ISO8601 duration correctly', () => {
      expect((service as any).parseISO8601Duration('PT1H30M')).toEqual([1, 30]);
    });
  });
});
