import Account from "../entities/Account";

export interface IAccountRepository {
    getByEmail(email: string) : Promise<Account | null>;
    getById(accountId: string) : Promise<Account | null>;
    save(account: Account) : Promise<void>;
}