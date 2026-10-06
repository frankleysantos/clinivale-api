import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { UserResponseInterceptor } from './interceptor/user-response.interceptor';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto, @User() user) {
    console.log('criando usuarios', user);
    // return this.userService.create(createUserDto, client);
  }

  //   @UseInterceptors(UserResponseInterceptor) - interceptor personalizado
  // ClassSerializerInterceptor esse interceptor serve para quando esta excluido na entidade não retorne esses campos
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(Number(id), '');
  }

  @Patch('/:id/update')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/:id/delete')
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
