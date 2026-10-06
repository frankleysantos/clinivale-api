import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/user/user.repository';


export type User = any;
@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository
  ) {}

  async login(createAuthDto: CreateAuthDto) : Promise<Auth> {
    const user = await this.userRepository.getOne(0, createAuthDto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const validPassword = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException();
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email, name: user.name });
    return { 
      user,
      access_token: token 
    };
  }

  async me(token: string): Promise<Auth> {
    const replaceToken = token.replace('Bearer ', '');
    const payload = this.jwtService.verify(replaceToken);
    console.log('me', payload)
    return {
      user: payload,
      access_token: replaceToken
    };
  }


}
