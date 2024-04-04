import Account from "../../domain/entities/Account";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";

export default class AccountRepositoryMemory implements IAccountRepository{
    private accounts: Account[];

    constructor(){
        this.accounts = [];
    }
    async getByEmail(email: string): Promise<Account | null> {
        const account = this.accounts.find(account => account.email.getValue() === email);
        if(!account) return null;
        return account;
    }
    async save(account: Account): Promise<void> {
        this.accounts.push(account);
    }
}