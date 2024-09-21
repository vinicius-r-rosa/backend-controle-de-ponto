import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batida, BatidaDocument } from '../batida/batida.schema';
import { RelatorioDto } from './relatorio.dto';
import {
  format,
  startOfMonth,
  endOfMonth,
  differenceInMinutes,
  eachDayOfInterval,
  isWeekend,
  parseISO,
} from 'date-fns';

const JORNADA_DIARIA_HORAS_DEFAULT = 8;
@Injectable()
export class RelatorioService {
  constructor(
    @InjectModel(Batida.name)
    private readonly batidaModel: Model<BatidaDocument>,
  ) {}

  async gerarRelatorios(): Promise<RelatorioDto[]> {
    const batidas = await this.batidaModel.find().exec();

    const relatorios = new Map<string, Batida[]>();
    batidas.forEach((batida) => {
      const anoMes = format(batida.momento, 'yyyy-MM');
      if (!relatorios.has(anoMes)) {
        relatorios.set(anoMes, []);
      }
      relatorios.get(anoMes).push(batida);
    });

    const relatoriosDto = await Promise.all(
      Array.from(relatorios.keys()).map((anoMes) =>
        this.gerarRelatorio(anoMes),
      ),
    );

    return relatoriosDto;
  }

  async gerarRelatorio(anoMes: string): Promise<RelatorioDto> {
    const [ano, mes] = anoMes.split('-').map(Number);
    if (isNaN(ano) || isNaN(mes) || mes < 1 || mes > 12) {
      throw new NotFoundException('Parâmetro anoMes inválido');
    }

    const inicioDoMes = startOfMonth(new Date(ano, mes - 1));
    const fimDoMes = endOfMonth(new Date(ano, mes - 1));
    const batidasDoMes = await this.batidaModel
      .find({ momento: { $gte: inicioDoMes, $lt: fimDoMes } })
      .exec();

    if (batidasDoMes.length === 0) {
      throw new NotFoundException('Relatório não encontrado');
    }

    const horasMensais =
      this.diasUteisNoMes(ano, mes) * JORNADA_DIARIA_HORAS_DEFAULT;
    const totalHorasTrabalhadas = this.calcularHorasTrabalhadas(batidasDoMes);
    const horasExcedentes = this.calcularHorasExcedentes(
      totalHorasTrabalhadas,
      horasMensais,
    );
    const horasDevidas = this.calcularHorasDevidas(
      totalHorasTrabalhadas,
      horasMensais,
    );

    return {
      anoMes,
      horasTrabalhadas: totalHorasTrabalhadas,
      horasExcedentes,
      horasDevidas,
      expedientes: this.organizarExpedientes(batidasDoMes),
    };
  }

  private organizarExpedientes(batidas: Batida[]): any[] {
    const batidasOrdenadas = batidas
      .map((batida) => ({
        momento: new Date(batida.momento),
      }))
      .sort((a, b) => a.momento.getTime() - b.momento.getTime());

    const expedientes = [];
    let currentExpediente = {
      dia: format(batidasOrdenadas[0].momento, 'yyyy-MM-dd'),
      pontos: [],
    };

    batidasOrdenadas.forEach((batida) => {
      const dia = format(batida.momento, 'yyyy-MM-dd');
      if (currentExpediente.dia !== dia) {
        expedientes.push(currentExpediente);
        currentExpediente = { dia, pontos: [] };
      }
      currentExpediente.pontos.push(format(batida.momento, 'HH:mm:ss'));
    });

    expedientes.push(currentExpediente);
    return expedientes;
  }

  private calcularHorasTrabalhadas(batidas: Batida[]): string {
    let totalMinutes = 0;

    this.organizarExpedientes(batidas).forEach((exp) => {
      if (exp.pontos.length === 4) {
        const [inicioExpediente, inicioAlmoço, fimAlmoço, fimExpediente] =
          exp.pontos.map((p) => parseISO(`${exp.dia}T${p}`));
        totalMinutes += differenceInMinutes(fimExpediente, inicioExpediente);
        totalMinutes -= differenceInMinutes(fimAlmoço, inicioAlmoço);
      }
    });

    return `PT${Math.floor(totalMinutes / 60)}H${totalMinutes % 60}M`;
  }

  private diasUteisNoMes(ano: number, mes: number): number {
    const primeiroDia = new Date(ano, mes - 1, 1);
    const ultimoDia = endOfMonth(primeiroDia);
    return eachDayOfInterval({ start: primeiroDia, end: ultimoDia }).filter(
      (dia) => !isWeekend(dia),
    ).length;
  }

  private calcularHorasExcedentes(
    totalHorasTrabalhadas: string,
    horasMensais: number,
  ): string {
    const [hours, minutes] = this.parseISO8601Duration(totalHorasTrabalhadas);
    const totalMinutes = hours * 60 + minutes;
    const excedentes = totalMinutes - horasMensais * 60;
    return excedentes > 0
      ? `PT${Math.floor(excedentes / 60)}H${excedentes % 60}M`
      : 'PT0S';
  }

  private calcularHorasDevidas(
    totalHorasTrabalhadas: string,
    horasMensais: number,
  ): string {
    const [hours, minutes] = this.parseISO8601Duration(totalHorasTrabalhadas);
    const totalMinutes = hours * 60 + minutes;
    const devidas = horasMensais * 60 - totalMinutes;
    return devidas > 0
      ? `PT${Math.floor(devidas / 60)}H${devidas % 60}M`
      : 'PT0S';
  }

  private parseISO8601Duration(duration: string): [number, number] {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = match ? parseInt(match[1]?.replace('H', '') || '0', 10) : 0;
    const minutes = match ? parseInt(match[2]?.replace('M', '') || '0', 10) : 0;
    return [hours, minutes];
  }
}
