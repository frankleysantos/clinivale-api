import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouncilEntity } from '../entities/council.entity';
import { ProfessionEntity } from '../entities/profession.entity';
import { SpecialtyEntity } from '../entities/specialty.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Profissionais de Saúde - Auxiliares')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('professionals')
export class ProfessionalAuxController {
    constructor(
        @InjectRepository(CouncilEntity)
        private readonly councilRepository: Repository<CouncilEntity>,
        @InjectRepository(ProfessionEntity)
        private readonly professionRepository: Repository<ProfessionEntity>,
        @InjectRepository(SpecialtyEntity)
        private readonly specialtyRepository: Repository<SpecialtyEntity>,
    ) {}

    @ApiOperation({ summary: 'Listar conselhos profissionais cadastrados' })
    @ApiResponse({ status: 200, description: 'Lista de conselhos ativos' })
    @Get('councils')
    async getCouncils() {
        return this.councilRepository.find({
            where: { status: 'ACTIVE' },
            order: { code: 'ASC' },
        });
    }

    @ApiOperation({ summary: 'Listar profissões de saúde (Médico, Fisioterapeuta, etc.)' })
    @ApiResponse({ status: 200, description: 'Lista de profissões ativas com seus respectivos conselhos' })
    @Get('professions')
    async getProfessions() {
        return this.professionRepository.find({
            where: { status: 'ACTIVE' },
            relations: ['council'],
            order: { name: 'ASC' },
        });
    }

    @ApiOperation({ summary: 'Listar especialidades ativas (com filtro por profissão)' })
    @ApiQuery({ name: 'profession_id', required: false, type: Number, description: 'Filtrar especialidades da profissão' })
    @ApiResponse({ status: 200, description: 'Lista de especialidades' })
    @Get('specialties')
    async getSpecialties(@Query('profession_id') professionId?: number) {
        if (professionId) {
            return this.specialtyRepository.find({
                where: { profession_id: Number(professionId), status: 'ACTIVE' },
                order: { name: 'ASC' },
            });
        }
        return this.specialtyRepository.find({
            where: { status: 'ACTIVE' },
            relations: ['profession'],
            order: { name: 'ASC' },
        });
    }
}
