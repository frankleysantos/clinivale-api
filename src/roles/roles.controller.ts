import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-roles.dto';
import { RolesService } from './roles.service';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('roles')
export class RolesController {

    constructor(private readonly roleService: RolesService) { }

    @Get()
    getAllRoles(){
        return this.roleService.findAll();
    }

    @Post('create')
    createRoles(@Body() role: CreateRoleDto) {
        return this.roleService.create(role);
    }

    @Public()
    @Post('adm')
    rolesAdm() {
        return this.roleService.rolesAdm();
    }
}
