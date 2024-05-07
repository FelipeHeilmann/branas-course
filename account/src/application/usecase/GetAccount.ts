// use case

import { AccountRepository } from "../../infra/repository/AccountRepository";

export class GetAccount {

	constructor (readonly accountRepository: AccountRepository) {
	}

	async execute (input: Input): Promise<Output> {
		const account = await this.accountRepository.getAccountById(input.accountId);
		return {
			accountId: account.accountId,
			name: account.getName(),
			email: account.getEmail(),
			cpf: account.getCPF(),
			isDriver: account.isDriver,
			isPassenger: account.isPassenger,
			carPlate: account.getCarPlate()
		}
	}
}

type Output = {
	accountId: string,
	name: string,
	email: string,
	cpf: string,
	isDriver: boolean,
	isPassenger: boolean,
	carPlate?: string,	
}

type Input = {
	accountId: string
}