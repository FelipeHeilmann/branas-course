
import Account from "../../domain/entities/Account";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";

export class Signup {
    
    constructor(private readonly accountRepository: IAccountRepository){}

    async execute(input: Input) {
        const existsAccount =  await this.accountRepository.getByEmail(input.email);
        if(existsAccount) throw new Error("Email already in use");
        const account = Account.create(input.name, input.email, input.cpf, input.isPassenger ?? false, input.carPlate ?? null);
        await this.accountRepository.save(account);
        return { 
            accountId: account.id
        }
    }
}

type Input = {
    name: string,
    email: string,
    cpf: string,
    isPassenger?: boolean,
    isDriver?: boolean,
    carPlate? : string
}