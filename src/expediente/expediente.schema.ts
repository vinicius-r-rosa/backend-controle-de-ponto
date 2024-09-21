import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpedienteDocument = Expediente & Document;

@Schema()
export class Expediente {
  @Prop({ required: true })
  dia: string;

  @Prop({ required: true })
  pontos: string[];
}

export const ExpedienteSchema = SchemaFactory.createForClass(Expediente);
