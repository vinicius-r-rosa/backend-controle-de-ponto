import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BatidaDocument = Batida & Document;

@Schema()
export class Batida {
  @Prop({ required: true })
  momento: Date;
}

export const BatidaSchema = SchemaFactory.createForClass(Batida);
