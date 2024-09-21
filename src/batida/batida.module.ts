import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BatidaController } from './batida.controller';
import { Batida, BatidaSchema } from './batida.schema';
import { BatidaService } from './batida.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Batida.name, schema: BatidaSchema }]),
  ],
  providers: [BatidaService],
  controllers: [BatidaController],
})
export class BatidaModule {}
