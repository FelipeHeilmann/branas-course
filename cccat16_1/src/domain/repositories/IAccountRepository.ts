import Account from "../entities/Account";

export interface IAccountRepository {
    getByEmail(email: string) : Promise<Account | null>;
    save(account: Account) : Promise<void>;
}