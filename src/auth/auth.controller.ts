import { Controller, Get, Post, Body, Headers, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Public } from './decorator/public.decorator';
import { User } from './decorator/user.decorator';
import { CNPJ_VALIDATE, CPF_VALIDATE } from 'src/global/common/constants/general.constant';
import type { CpfOrCNPJ } from 'src/global/common/validator/cpf-or-cnpj.interface';

@ApiTags('Autenticação')
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
  @ApiOperation({ summary: 'Realizar login de usuário' })
  @Post('/login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Public()
  @ApiOperation({ summary: 'Gerar hash de senha' })
  @ApiBody({ schema: { type: 'object', properties: { password: { type: 'string', example: '123456' } } } })
  @Post('/pwd')
  create(@Body('password') pwd: string) {
    return bcrypt.hashSync(pwd, 10);
  }

  @Public()
  @ApiOperation({ summary: 'Testar validação de CPF' })
  @Get('/validate')
  verify() {
    const validateCPF = this.validarCpf.execute('09019872630');
    return validateCPF;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  @Get('/me')
  me(@Headers('authorization') authorization: string) {
    return this.authService.me(authorization);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar clínica ativa do usuário logado' })
  @Post('/switch-client')
  switchClient(@User() user: any, @Body('client_id') clientId: number) {
    return this.authService.switchClient(user.id, clientId);
  }

}
