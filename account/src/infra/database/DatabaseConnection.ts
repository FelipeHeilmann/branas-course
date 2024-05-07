// framework and driver

import pgp from "pg-promise";

export default interface DatabaseConnection {
	connection: any
	query (statement: string, params: any, transactional?: boolean): Promise<any>;
	close (): Promise<void>;
	commit(): Promise<void>
}

export class PgPromiseAdapter implements DatabaseConnection {
	connection: any;

	constructor () {
		this.connection = pgp()("postgres://postgres:postgres@localhost:5432/branas");
	}

	query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}

	close(): Promise<void> {
		return this.connection.$pool.end();
	}

	async commit(): Promise<void> {
		return;
	}
}

export class UnitOfWork implements DatabaseConnection {
	connection: any;
	statements: {statement: string, params: any}[]

	constructor () {
		this.connection = pgp()("postgres://postgres:postgres@localhost:5432/branas");
		this.statements = [];
	}

	async query(statement: string, params: any, transactional: boolean =  false): Promise<any> {
		if(!transactional) {
			return this.connection.query(statement, params);
		}
		this.statements.push({ statement: statement, params });
	}

	close(): Promise<void> {
		return this.connection.$pool.end();
	}

	async commit(): Promise<void> {
		await this.connection.tx(async (t: any) => {
			const transactions = [];
			for (const statement of this.statements) {
				transactions.push(await t.query(statement.statement, statement.params));
			}
			return t.batch(transactions);
		}).then((data: any) => {
			console.log("commit");
		}).catch((data: any) => {
			console.log("rollback");
		});
	}
}