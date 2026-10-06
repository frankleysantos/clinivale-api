import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (controller: string, method: string) =>
SetMetadata(ROLES_KEY, { controller, method });
