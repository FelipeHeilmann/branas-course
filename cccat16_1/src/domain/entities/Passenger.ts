import Account from "./Account";
import { CPF } from "./CPF";
import { Email } from "./Email";
import { Name } from "./Name";
import crypto from "node:crypto";

export default class Pessanger extends Account {
    private constructor(id: string, name: Name, email: Email, cpf: CPF){
        super(id, name, email, cpf, true, null);
    }

    static create(rawName: string, rawEmail: string, rawCpf: string) {
        const id = crypto.randomUUID();
        const name = Name.create(rawName);
        const email = Email.create(rawEmail);
        const cpf = CPF.create(rawCpf);

        return new Pessanger(id, name, email, cpf);
    }

    static restore(id: string, rawName: string, rawEmail: string, rawCpf: string) {
        const name = Name.create(rawName);
        const email = Email.create(rawEmail);
        const cpf = CPF.create(rawCpf);

        return new Pessanger(id, name, email, cpf);
    } 
}