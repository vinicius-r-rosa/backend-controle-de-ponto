import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatidaModule } from '../batida/batida.module';
import { RelatorioModule } from '../relatorio/relatorio.module';
import { AppModule } from './app.module';
import { config } from '../config';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(config.db.uri),
        BatidaModule,
        RelatorioModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  it('should be defined', () => {
    const module = appModule.get<AppModule>(AppModule);
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const appController = appModule.get<AppController>(AppController);
    expect(appController).toBeDefined();
  });

  it('should have AppService', () => {
    const appService = appModule.get<AppService>(AppService);
    expect(appService).toBeDefined();
  });

  it('should import BatidaModule', () => {
    const batidaModule = appModule.get<BatidaModule>(BatidaModule);
    expect(batidaModule).toBeDefined();
  });

  it('should import RelatorioModule', () => {
    const relatorioModule = appModule.get<RelatorioModule>(RelatorioModule);
    expect(relatorioModule).toBeDefined();
  });

  it('should connect to the database', () => {
    const mongooseModule = appModule.get<MongooseModule>(MongooseModule);
    expect(mongooseModule).toBeDefined();
  });
});
