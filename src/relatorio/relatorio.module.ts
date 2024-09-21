import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Batida, BatidaSchema } from '../batida/batida.schema';
import { RelatorioController } from './relatorio.controller';
import { RelatorioService } from './relatorio.service';
import { BatidaModule } from '../batida/batida.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Batida.name, schema: BatidaSchema }]),
    BatidaModule,
  ],
  providers: [RelatorioService],
  controllers: [RelatorioController],
})
export class RelatorioModule {}
