import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { DeepPartial } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from 'src/auth/decorator/user.decorator';

@Injectable()
export class UserService {
  
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto, clientId) {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const partial: DeepPartial<UserEntity> = {
      ...createUserDto
    }
    return this.userRepository.created(partial);
  }

  findAll() {
    return this.userRepository.getAll();
  }

  findOne(id: number, email: string) {
    return this.userRepository.getOne(id, email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
