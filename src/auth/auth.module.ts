import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtGuard, 
    RolesGuard,
  ],
  exports: [JwtGuard, RolesGuard, UserModule],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '8h' },
    }),
  ]
})
export class AuthModule {}
