// entity

import CPF from "../vo/CPF";
import CarPlate from "../vo/CarPlate";
import Email from "../vo/Email";
import Name from "../vo/Name";
import crypto from "crypto";

export default class Account {

	private constructor (readonly accountId: string, private name: Name, private email: Email, private cpf: CPF, private carPlate: CarPlate, readonly isPassenger: boolean, readonly isDriver: boolean) {
	}

	static create (name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
		const accountId = crypto.randomUUID();
		return new Account(accountId, new Name(name), new Email(email), new CPF(cpf), new CarPlate(carPlate), isPassenger, isDriver);
	}

	static restore (accountId: string, name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
		return new Account(accountId, new Name(name), new Email(email), new CPF(cpf), new CarPlate(carPlate), isPassenger, isDriver);
	}

	getName () {
		return this.name.getValue();
	}

	getEmail () {
		return this.email.getValue()
	}

	getCPF () {
		return this.cpf.getValue();
	}

	getCarPlate () {
		return this.carPlate.getValue();
	}
}