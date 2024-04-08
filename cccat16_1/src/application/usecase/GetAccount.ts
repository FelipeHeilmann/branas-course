import { IAccountRepository } from "../../domain/repositories/IAccountRepository";

export default class GetAccount {
    constructor(readonly accountRepository: IAccountRepository){}

    async execute(accountId: string): Promise<Output> {
        const account = await this.accountRepository.getById(accountId);
        if(!account) throw new Error("Account not found");
        return {
            name: account.name.getValue(),
            email: account.email.getValue(),
            cpf: account.cpf.getValue()
        }
    }
}

type Output = {
    name: string,
    email: string,
    cpf: string
}