import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiTags('Seed / Inicialização')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Public()
  @ApiOperation({ summary: 'Executar seed para criar cliente Clinivale, role ADMINISTRADOR e usuário master' })
  @Post()
  runSeed() {
    return this.seedService.runSeed();
  }
}
