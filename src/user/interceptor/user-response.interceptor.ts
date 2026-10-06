import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// este é exemplo de interceptor do response personalizado
@Injectable()
export class UserResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    return next.handle().pipe(
      map((users) => {
        return users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }));
      }),
    );
  }
}