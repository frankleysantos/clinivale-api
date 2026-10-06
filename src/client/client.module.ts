import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { ClientRepository } from './client.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),
    UserModule
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
})
export class ClientModule {}
