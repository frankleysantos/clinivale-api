import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-roles.dto';
import { RolesService } from './roles.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { User } from 'src/auth/decorator/user.decorator';

@ApiTags('Permissões (Roles)')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {

    constructor(private readonly roleService: RolesService) { }

    @ApiOperation({ summary: 'Listar todas as permissões/roles' })
    @ApiQuery({ name: 'client_id', required: false, type: Number, description: 'Filtrar roles por cliente' })
    @Get()
    getAllRoles(@Query('client_id') clientId?: string, @User() user?: any){
        const parsedClientId = clientId ? parseInt(clientId, 10) : (user?.client?.id || user?.clientId || user?.clients?.[0]?.id);
        return this.roleService.findAll(parsedClientId);
    }

    @ApiOperation({ summary: 'Criar nova permissão/role' })
    @Post('create')
    createRoles(@Body() role: CreateRoleDto, @User() user?: any) {
        return this.roleService.create(role, user);
    }

    @Public()
    @ApiOperation({ summary: 'Inicializar permissão ADM padrão' })
    @Post('adm')
    rolesAdm() {
        return this.roleService.rolesAdm();
    }
}
