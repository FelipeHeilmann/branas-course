import Account from "../../domain/entities/Account";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import pgp from "pg-promise";

export class AccountRepositoryDatabase implements IAccountRepository {
    async getByEmail(email: string): Promise<Account | null> {
        const connection = pgp()("postgres://postgres:postgres@localhost:5432/branas");
        const [account] = await connection.query("select * from cccat16.account where email = $1", [email]);
        await connection.$pool.end();
        if(!account) return null;
        return Account.restore(account.id, account.name, account.email, account.cpf, account.is_passenger, account.car_plate);
    }
    async save(account: Account): Promise<void> {
        const connection = pgp()("postgres://postgres:postgres@localhost:5432/branas");
        await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.id, account.name.getValue(), account.email.getValue(), account.cpf.getValue(), account.carPlate?.getValue(), !!account.isPassenger, !!account.isDriver]);              
        await connection.$pool.end();
    }
}