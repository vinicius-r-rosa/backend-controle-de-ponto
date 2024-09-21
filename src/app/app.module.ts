import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatidaModule } from '../batida/batida.module';
import { RelatorioModule } from '../relatorio/relatorio.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.db.uri),
    BatidaModule,
    RelatorioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
