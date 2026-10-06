import { CpfOrCNPJ } from "./cpf-or-cnpj.interface";

export class ValidarCpf implements CpfOrCNPJ {
    execute(cpf: string): boolean {
        cpf = cpf.replace(/\D/g, '');

        if (cpf.length !== 11) {
            return false;
        }

        if (/^(\d)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;

        // Primeiro dígito
        for (let i = 0; i < 9; i++) {
            soma += Number(cpf[i]) * (10 - i);
        }

        let resto = (soma * 10) % 11;
        resto = resto === 10 ? 0 : resto;

        if (resto !== Number(cpf[9])) {
            return false;
        }

        soma = 0;

        // Segundo dígito
        for (let i = 0; i < 10; i++) {
            soma += Number(cpf[i]) * (11 - i);
        }

        resto = (soma * 10) % 11;
        resto = resto === 10 ? 0 : resto;

        if (resto !== Number(cpf[10])) {
            return false;
        }

        return true;
    }
}