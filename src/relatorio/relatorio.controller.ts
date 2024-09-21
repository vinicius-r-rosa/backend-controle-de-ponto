import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { RelatorioService } from './relatorio.service';

@Controller('v1/folhas-de-ponto')
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async gerarRelatorios() {
    return this.relatorioService.gerarRelatorios();
  }

  @Get(':anoMes')
  @HttpCode(HttpStatus.OK)
  async gerarRelatorio(@Param('anoMes') anoMes: string) {
    return this.relatorioService.gerarRelatorio(anoMes);
  }
}
