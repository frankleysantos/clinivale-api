import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

    if (!user?.roles?.length) return false;

    const methodName = context.getHandler().name;

    return user.roles.some((role) =>
      role.permissions?.some(
        (p) => p.controller === controllerName && p.method === methodName,
      ),
    );
  }
}
