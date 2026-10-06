import { CpfOrCNPJ } from "./cpf-or-cnpj.interface";

export class ValidarCnpj implements CpfOrCNPJ{
    execute(cnpj: string) : boolean {
        console.log('classe responsavel por validar o cnpj', cnpj)
        return true;
    }
}