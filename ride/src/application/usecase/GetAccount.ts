// use case

import crypto from "crypto";
import { AccountRepository } from "../../infra/repository/AccountRepository";

export class GetAccount {

	constructor (readonly accountRepository: AccountRepository) {
	}

	async execute (input: any): Promise<Output> {
		const account = await this.accountRepository.getAccountById(input.accountId);
		return {
			accoundId: account.accountId,
			name: account.getName(),
			email: account.getEmail(),
			cpf: account.getCPF(),
			isDriver: account.isDriver,
			isPassenger: account.isDriver,
			carPlate: account.getCarPlate()
		}
	}
}

type Output = {
	accoundId: string,
	name: string,
	email: string,
	cpf: string,
	isDriver: boolean,
	isPassenger: boolean,
	carPlate?: string,	
}