import { ExpedienteDto } from '../expediente/expediente.dto';

export class RelatorioDto {
  anoMes: string;
  horasTrabalhadas: string;
  horasExcedentes: string;
  horasDevidas: string;
  expedientes: ExpedienteDto[];
}
