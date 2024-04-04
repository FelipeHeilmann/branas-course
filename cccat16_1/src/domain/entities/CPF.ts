export class CPF {
    private value: string;

    private constructor (cpf: string) {
        this.value = cpf;
    }

    static create(rawCpf: string) {
        const cpf = CPF.validate(rawCpf);
        return new CPF(cpf);
    }

    private static validate(rawCpf: string){
        if (!rawCpf) throw new Error("Invalid CPF"); 
        const cpf = CPF.removeNonDigits(rawCpf);
        if (!CPF.isValidLenght(cpf)) throw new Error("Invalid CPF"); 
        if (CPF.isAllDigitsEqual(cpf)) throw new Error("Invalid CPF"); 
        const firstDigit = CPF.calculateDigit(cpf.slice(0, 9), 10);
        const secondDigit = CPF.calculateDigit(cpf.slice(0, 9) + firstDigit, 11);
        if(cpf.slice(9) !==`${firstDigit}${secondDigit}`) throw new Error("Invalid CPF"); 
        return cpf;
    }

    private static  removeNonDigits(cpf: string) { 
        return cpf.replace(/\D/g, '');
    } 

    private static isValidLenght(cpf:string) {
        return cpf.length === 11;
    }

    private static isAllDigitsEqual(cpf: string) {
        const [firstDigit] = cpf;
        return cpf.split("").every(digit => digit === firstDigit)
    }

    private static calculateDigit(cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            total += Number(digit) * factor--;
        }
        const remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    getValue(){
        return this.value;
    }
}