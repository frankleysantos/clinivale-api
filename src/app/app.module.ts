import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from 'src/config/database.config';
import { ClientModule } from 'src/client/client.module';
import { PatientModule } from 'src/patient/patient.module';
import { RolesModule } from 'src/roles/roles.module';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { GlobalModule } from 'src/global/global.module';
import { SeedModule } from 'src/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule,
    AuthModule,
    ClientModule,
    PatientModule,
    RolesModule,
    GlobalModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],

})
export class AppModule {}
