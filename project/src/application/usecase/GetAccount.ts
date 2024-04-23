// use case

import crypto from "crypto";
import { AccountRepository } from "../../infra/repository/AccountRepository";

export class GetAccount {

	constructor (readonly accountRepository: AccountRepository) {
	}

	async execute (input: any): Promise<any> {
		const account = await this.accountRepository.getAccountById(input.accountId);
		return account;
	}
}