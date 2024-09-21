import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { differenceInMinutes, format, isValid, isWeekend } from 'date-fns';
import { Model } from 'mongoose';
import { ExpedienteDto } from '../expediente/expediente.dto';
import { BatidaDto } from './batida.dto';
import { Batida, BatidaDocument } from './batida.schema';
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class BatidaService {
  constructor(
    @InjectModel(Batida.name)
    private readonly batidaModel: Model<BatidaDocument>,
  ) {}

  async deletarBatidas(): Promise<boolean> {
    try {
      await this.batidaModel.deleteMany().exec();
      return true;
    } catch (error) {
      console.error('Error deleting batidas:', error);
      throw new BadRequestException('Failed to delete batidas');
    }
  }

  async registrarBatida(batidaDto: BatidaDto): Promise<ExpedienteDto> {
    const momento = toZonedTime(batidaDto.momento, 'America/Sao_Paulo');
    Logger.debug(`momento: ${momento}`);

    if (!isValid(momento)) {
      throw new BadRequestException('Data inválida');
    }

    const dia = format(momento, 'yyyy-MM-dd');
    const diaSeguinte = new Date(momento);
    diaSeguinte.setDate(diaSeguinte.getDate() + 1);

    const existingBatida = await this.batidaModel.findOne({ momento }).exec();

    if (existingBatida) {
      throw new ConflictException('Horário já registrado');
    }

    const batidasDoDia = await this.batidaModel
      .find({
        momento: {
          $gte: new Date(dia),
          $lt: diaSeguinte,
        },
      })
      .exec();
    Logger.debug('Obteve batidas do dia');

    this.validarBatida(momento, batidasDoDia);

    const novaBatida = new this.batidaModel({
      ...batidaDto,
      momento,
    });
    await novaBatida.save();
    Logger.debug('Nova Batida Salva');

    const batidasDoDiaAtualizado = await this.batidaModel
      .find({
        momento: {
          $gte: new Date(dia),
          $lt: diaSeguinte,
        },
      })
      .exec();

    return this.gerarExpediente(dia, batidasDoDiaAtualizado);
  }

  private validarBatida(momento: Date, batidasDoDia: Batida[]): void {
    const hora = momento.getHours();
    if (hora < 6 || hora > 20) {
      throw new BadRequestException('Batidas só são permitidas entre 6h e 20h');
    }

    if (isWeekend(momento)) {
      throw new BadRequestException(
        'Sábado e domingo não são permitidos como dia de trabalho',
      );
    }

    if (batidasDoDia.length > 0) {
      const ultimaBatida = batidasDoDia[batidasDoDia.length - 1];
      if (momento < new Date(ultimaBatida.momento)) {
        throw new BadRequestException(
          'O horário da batida não pode ser anterior ao último horário registrado',
        );
      }

      const intervaloMinimo = 15;
      if (
        differenceInMinutes(momento, new Date(ultimaBatida.momento)) <
        intervaloMinimo
      ) {
        throw new BadRequestException(
          `O intervalo entre batidas deve ser de pelo menos ${intervaloMinimo} minutos`,
        );
      }
    }

    if (batidasDoDia.length >= 4) {
      throw new BadRequestException(
        'Apenas 4 horários podem ser registrados por dia',
      );
    }

    if (batidasDoDia.length >= 2) {
      if (
        differenceInMinutes(momento, new Date(batidasDoDia[1].momento)) < 60
      ) {
        throw new BadRequestException(
          'O intervalo de almoço deve ter pelo menos 1 hora',
        );
      }
    }
  }

  private gerarExpediente(dia: string, batidas: Batida[]): ExpedienteDto {
    return {
      dia,
      pontos: batidas.map((batida) =>
        format(new Date(batida.momento), 'HH:mm:ss'),
      ),
    };
  }
}
