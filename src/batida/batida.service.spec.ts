import { BadRequestException, ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BatidaService } from './batida.service';
import { Batida } from '../batida/batida.schema';
import { BatidaDto } from './batida.dto';

describe('BatidaService', () => {
  let service: BatidaService;

  // TODO: Implementar melhor os mocks para os testes...
  const mockBatidaModel = {
    deleteMany: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatidaService,
        {
          provide: getModelToken(Batida.name),
          useValue: mockBatidaModel,
        },
      ],
    }).compile();

    service = module.get<BatidaService>(BatidaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registrarBatida', () => {
    it('should throw BadRequestException if momento is invalid', async () => {
      const batidaDto: BatidaDto = { momento: new Date('2018-09-31T08:00:00') };

      // TODO: Entender se o erro está sendo causado por não conectar no db.
      await expect(service.registrarBatida(batidaDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if batida already exists', async () => {
      const batidaDto: BatidaDto = { momento: new Date('2018-08-31T08:00:00') };
      mockBatidaModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(true),
      });

      await expect(service.registrarBatida(batidaDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should save a new batida and return expediente', async () => {
      const batidaDto: BatidaDto = { momento: new Date('2018-08-03T12:00:00') };
      mockBatidaModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      mockBatidaModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([]),
      });
      mockBatidaModel.save.mockResolvedValueOnce({});

      // TODO: Entender se o erro está sendo causado por não conectar no db.
      const result = await service.registrarBatida(batidaDto);

      expect(mockBatidaModel.findOne).toHaveBeenCalled();
      expect(mockBatidaModel.find).toHaveBeenCalled();
      expect(mockBatidaModel.save).toHaveBeenCalled();
      expect(result).toEqual({
        dia: expect.any(String),
        pontos: expect.any(Array),
      });
    });

    it('should throw BadRequestException if batida is outside allowed hours', async () => {
      const batidaDto: BatidaDto = { momento: new Date('2018-08-03T21:00:00') };
      mockBatidaModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      mockBatidaModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([]),
      });

      await expect(service.registrarBatida(batidaDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if batida is on weekend', async () => {
      const batidaDto: BatidaDto = { momento: new Date('2018-08-28T08:00:00') }; // Weekend
      // TODO: Entender se o erro está sendo causado por não conectar no db.
      await expect(service.registrarBatida(batidaDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if less than 15 minutes apart', async () => {
      const batidaDto: BatidaDto = { momento: new Date() };
      const batidasDoDia = [
        { momento: new Date(batidaDto.momento.getTime() - 10 * 60000) },
      ];
      mockBatidaModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      mockBatidaModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(batidasDoDia),
      });

      await expect(service.registrarBatida(batidaDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if more than 4 batidas are registered', async () => {
      const batidaDto: BatidaDto = { momento: new Date() };
      const batidasDoDia = Array(4).fill({ momento: new Date() });
      mockBatidaModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      mockBatidaModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(batidasDoDia),
      });

      await expect(service.registrarBatida(batidaDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if lunch break is less than 1 hour', async () => {
      const batidaDto: BatidaDto = { momento: new Date() };
      const batidasDoDia = [
        { momento: new Date() },
        { momento: new Date(batidaDto.momento.getTime() - 30 * 60000) },
      ];
      mockBatidaModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      mockBatidaModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(batidasDoDia),
      });

      await expect(service.registrarBatida(batidaDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deletarBatidas', () => {
    it('should delete all batidas and return true', async () => {
      const result = await service.deletarBatidas();
      expect(mockBatidaModel.deleteMany).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw BadRequestException if deletion fails', async () => {
      mockBatidaModel.exec.mockRejectedValueOnce(new Error('Deletion error'));
      await expect(service.deletarBatidas()).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
