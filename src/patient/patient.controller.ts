import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { User } from 'src/auth/decorator/user.decorator';

@ApiTags('Pacientes')
@ApiBearerAuth()
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Criar novo paciente vinculado a um cliente' })
  @Post('create')
  create(@Body() createPatientDto: CreatePatientDto, @User() user: any) {
    return this.patientService.create(createPatientDto, user);
  }

  @ApiOperation({ summary: 'Listar pacientes (opcionalmente filtrados por cliente)' })
  @ApiQuery({ name: 'client_id', required: false, type: Number, example: 1, description: 'ID do cliente para filtrar pacientes' })
  @Get()
  findAll(@Query('client_id') clientId?: string, @User() user?: any) {
    const parsedClientId = clientId ? parseInt(clientId, 10) : undefined;
    return this.patientService.findAll(parsedClientId, user);
  }

  @ApiOperation({ summary: 'Buscar paciente por ID (inclui dados do cliente)' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do paciente' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar paciente por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do paciente' })
  @Patch(':id/update')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @ApiOperation({ summary: 'Deletar paciente por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID do paciente' })
  @Delete(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientService.remove(id);
  }
}
