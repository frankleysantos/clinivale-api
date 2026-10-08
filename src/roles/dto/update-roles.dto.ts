import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-roles.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
