import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const controllerName = context.getClass().name;
    if (controllerName === 'AuthController') {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user?.roles?.length) {
      throw new ForbiddenException('Usuário não possui perfis/permissões vinculadas a esta clínica');
    }

    const methodName = context.getHandler().name;

    const hasPermission = user.roles.some((role) =>
      role.permissions?.some(
        (p) =>
          p.controller?.toLowerCase() === controllerName.toLowerCase() &&
          p.method?.toLowerCase() === methodName.toLowerCase(),
      ),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Você não tem permissão para realizar esta ação nesta clínica');
    }

    return true;
  }
}


