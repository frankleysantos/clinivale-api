import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-roles.dto';
import { RolesService } from './roles.service';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiTags('Permissões (Roles)')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {

    constructor(private readonly roleService: RolesService) { }

    @ApiOperation({ summary: 'Listar todas as permissões/roles' })
    @Get()
    getAllRoles(){
        return this.roleService.findAll();
    }

    @ApiOperation({ summary: 'Criar nova permissão/role' })
    @Post('create')
    createRoles(@Body() role: CreateRoleDto) {
        return this.roleService.create(role);
    }

    @Public()
    @ApiOperation({ summary: 'Inicializar permissão ADM padrão' })
    @Post('adm')
    rolesAdm() {
        return this.roleService.rolesAdm();
    }
}
