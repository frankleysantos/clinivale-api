import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({ message: 'O name de usuário é obrigatório' })
    email: string;

    @IsNotEmpty({ message: 'A password é obrigatória' })
    password: string;
}
