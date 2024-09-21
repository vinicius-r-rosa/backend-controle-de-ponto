import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Expediente } from '../expediente/expediente.schema';

export type RelatorioDocument = Relatorio & Document;

@Schema()
export class Relatorio {
  @Prop({ required: true })
  anoMes: string;

  @Prop({ required: true })
  horasTrabalhadas: string;

  @Prop({ required: true })
  horasExcedentes: string;

  @Prop({ required: true })
  horasDevidas: string;

  @Prop({ required: true })
  expedientes: Expediente[];
}

export const RelatorioSchema = SchemaFactory.createForClass(Relatorio);
