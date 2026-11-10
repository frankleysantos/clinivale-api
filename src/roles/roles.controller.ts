import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-roles.dto';
import { UpdateRoleDto } from './dto/update-roles.dto';
import { RolesService } from './roles.service';
import { Public } from 'src/auth/decorator/public.decorator';
import { User } from 'src/auth/decorator/user.decorator';

@ApiTags('Permissões (Roles)')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {

    constructor(private readonly roleService: RolesService) { }

    @ApiOperation({ summary: 'Obter permissões disponíveis do sistema' })
    @Get('available-permissions')
    getAvailablePermissions() {
        return this.roleService.getAvailablePermissions();
    }

    @ApiOperation({ summary: 'Listar todas as permissões/roles' })
    @ApiQuery({ name: 'client_id', required: false, type: String, description: 'Filtrar roles por cliente ou "all" para todas as clínicas (apenas clínica mestre)' })
    @Get()
    getAllRoles(@Query('client_id') clientId?: string, @User() user?: any){
        return this.roleService.findAll(clientId, user);
    }

    @ApiOperation({ summary: 'Buscar perfil/role por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID da role' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.roleService.findOne(id);
    }

    @ApiOperation({ summary: 'Criar nova permissão/role' })
    @Post('create')
    createRoles(@Body() role: CreateRoleDto, @User() user?: any) {
        return this.roleService.create(role, user);
    }

    @ApiOperation({ summary: 'Atualizar permissão/role por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID da role' })
    @Patch(':id')
    updateRole(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto, @User() user?: any) {
        return this.roleService.update(id, updateRoleDto, user);
    }

    @ApiOperation({ summary: 'Remover permissão/role por ID' })
    @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID da role' })
    @Delete(':id')
    removeRole(@Param('id', ParseIntPipe) id: number) {
        return this.roleService.remove(id);
    }

    @Public()
    @ApiOperation({ summary: 'Inicializar permissão ADM padrão' })
    @Post('adm')
    rolesAdm() {
        return this.roleService.create({
            name: 'ADMINISTRADOR',
            permissions: [
                { controller: 'UserController', method: 'findAll' },
                { controller: 'RolesController', method: 'getAllRoles' },
                { controller: 'AuthController', method: 'login' },
                { controller: 'ClientController', method: 'findAll' },
            ]
        });
    }
}
