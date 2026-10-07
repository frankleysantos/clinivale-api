import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;
   
    if (!auth) return false;

    const token = auth.replace('Bearer ', '');
     
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.getOneWithRoles(payload.id);
      if (!user) return false;

      const targetClientId = payload.client_id ? Number(payload.client_id) : null;

      const selectedClient = targetClientId
        ? user.clients?.find((c) => Number(c.id) === targetClientId)
        : user.clients?.[0] || null;

      const activeRoles = user.roles?.filter((r) => {
        if (r.client_id == null) return true;
        return selectedClient && Number(r.client_id) === Number(selectedClient.id);
      }) || [];

      (user as any).client = selectedClient;
      (user as any).clientId = selectedClient?.id;
      (user as any).roles = activeRoles;

      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}