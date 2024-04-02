import Account from "../entities/Account";
import { Email } from "../entities/Email";

export interface IAccountRepository{
    getByEmail(email: string) : Promise<Account | null>;
    save(account: Account) : Promise<void>;
}