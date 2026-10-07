import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/auth/decorator/user.decorator';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Criar novo usuário' })
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto, @User() user) {
    const activeClientId = user?.client?.id || user?.clientId || user?.clients?.[0]?.id;
    return this.userService.create(createUserDto, activeClientId);
  }

  @ApiOperation({ summary: 'Listar todos os usuários (filtrados por cliente)' })
  @ApiQuery({ name: 'client_id', required: false, type: Number, description: 'Filtrar usuários por cliente' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query('client_id') clientId?: string, @User() user?: any) {
    const parsedClientId = clientId ? parseInt(clientId, 10) : (user?.client?.id || user?.clientId || user?.clients?.[0]?.id);
    return this.userService.findAll(parsedClientId);
  }

  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do usuário' })
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(Number(id), '');
  }

  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do usuário' })
  @Patch('/:id/update')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Deletar usuário por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do usuário' })
  @Delete('/:id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
