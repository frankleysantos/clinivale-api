import { IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { IsEmailUnique } from "./validators/is-email-unique.decorator";
import { Type } from "class-transformer";

export class CreateUserDto {
    @IsNotEmpty({ message: 'O name é obrigatório' })
    name: string;

    @IsNotEmpty({ message: 'A password é obrigatória' })
    password: string;

    @IsEmailUnique({ message: 'O email já está em uso' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    email: string;
}
