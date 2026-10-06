import { Controller, Get, Post, Body, Headers, UseGuards, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Public } from './decorator/public.decorator';
import { CNPJ_VALIDATE, CPF_VALIDATE } from 'src/global/common/constants/general.constant';
import type { CpfOrCNPJ } from 'src/global/common/validator/cpf-or-cnpj.interface';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @Inject(CPF_VALIDATE) 
    private readonly validarCpf: CpfOrCNPJ,

    @Inject(CNPJ_VALIDATE) 
    private readonly validarCNPJ: CpfOrCNPJ,
  ) {}

  @Public()
  @Post('/login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Public()
  @Post('/pwd')
  create(@Body('password') pwd: string) {
    return bcrypt.hashSync(pwd, 10);
  }

  @Public()
  @Get('/validate')
  verify() {
    const validateCPF = this.validarCpf.execute('09019872630');
    return validateCPF;
  }

  @Get('/me')
  me(@Headers('authorization') authorization: string) {
    return this.authService.me(authorization);
  }

}
