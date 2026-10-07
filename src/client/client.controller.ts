import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { User } from 'src/auth/decorator/user.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({ summary: 'Criar novo cliente' })
  @Post('create')
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @ApiOperation({ summary: 'Listar clientes (filtrados por cliente)' })
  @ApiQuery({ name: 'client_id', required: false, type: Number, description: 'ID do cliente' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(@Query('client_id') clientId?: string, @User() user?: any) {
    const parsedClientId = clientId ? parseInt(clientId, 10) : undefined;
    return this.clientService.findAll(parsedClientId, user);
  }

  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do cliente' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar cliente por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do cliente' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto);
  }

  @ApiOperation({ summary: 'Deletar cliente por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do cliente' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.remove(id);
  }
}
