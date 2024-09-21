import { IsNotEmpty, IsISO8601 } from 'class-validator';

export class BatidaDto {
  @IsNotEmpty()
  @IsISO8601()
  momento: Date;
}
