import { Global, Module } from '@nestjs/common';
import { CNPJ_VALIDATE, CPF_VALIDATE } from 'src/global/common/constants/general.constant';
import { ValidarCnpj } from 'src/global/common/validator/cnpj';
import { ValidarCpf } from 'src/global/common/validator/cpf';

@Global()
@Module({
    providers: [
        {
            provide: CPF_VALIDATE,
            useClass: ValidarCpf,
        },
        {
            provide: CNPJ_VALIDATE,
            useClass: ValidarCnpj,
        }
    ],
    exports: [
        CPF_VALIDATE,
        CNPJ_VALIDATE
    ],
})
export class GlobalModule {}
