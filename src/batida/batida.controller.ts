import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BatidaDto } from './batida.dto';
import { BatidaService } from './batida.service';

@Controller('v1/batidas')
export class BatidaController {
  constructor(private readonly batidaService: BatidaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registrarBatida(@Body() batidaDto: BatidaDto) {
    return this.batidaService.registrarBatida(batidaDto);
  }

  @Delete('/all')
  @HttpCode(HttpStatus.OK)
  async deletarBatidas() {
    return this.batidaService.deletarBatidas();
  }
}
