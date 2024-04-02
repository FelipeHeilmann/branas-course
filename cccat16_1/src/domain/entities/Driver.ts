import Account from "./Account";
import { CPF } from "./CPF";
import { Email } from "./Email";
import { Name } from "./Name";
import crypto from "node:crypto";
import { Plate } from "./Plate";

export default class Driver extends Account {
    private constructor(id: string, name: Name, email: Email, cpf: CPF, plate: Plate){
        super(id, name, email, cpf, false, plate);
    }

    static create(rawName: string, rawEmail: string, rawCpf: string, rawPlate: string) {
        const id = crypto.randomUUID();
        const name = Name.create(rawName);
        const email = Email.create(rawEmail);
        const cpf = CPF.create(rawCpf);
        const plate = Plate.create(rawPlate);

        return new Driver(id, name, email, cpf, plate);
    }

    static restore(id: string, rawName: string, rawEmail: string, rawCpf: string, rawPlate: string) {
        const name = Name.create(rawName);
        const email = Email.create(rawEmail);
        const cpf = CPF.create(rawCpf);
        const plate = Plate.create(rawPlate);

        return new Driver(id, name, email, cpf, plate);
    }
}