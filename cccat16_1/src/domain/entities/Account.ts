import { CPF } from "./CPF"
import { Email } from "./Email";
import { Name } from "./Name";
import { Plate } from "./Plate";
import crypto from "node:crypto";
export default class Account {
    readonly id: string;
    readonly name: Name;
    readonly email: Email;
    readonly cpf: CPF;
    readonly isPassenger: boolean;
    readonly isDriver: boolean;
    readonly carPlate: Plate | null;

    private constructor(id: string, name: Name, email: Email, cpf: CPF, isPassanger: boolean, plate: Plate | null){
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.isPassenger = isPassanger;
        this.isDriver = !isPassanger;
        this.carPlate = plate;
    }

    static create(inputName: string, inputEmail: string, inputCPF: string, isPassanger: boolean ,inputPlate: string | null) {
        const id = crypto.randomUUID();
        const name = Name.create(inputName);
        const email = Email.create(inputEmail);
        const cpf = CPF.create(inputCPF);
        const plate = inputPlate ? Plate.create(inputPlate) : null;
        return new Account(id, name, email, cpf, isPassanger, plate);
    }

    static restore(id: string, inputName: string, inputEmail: string, inputCPF: string, isPassanger: boolean, inputPlate: string | null) {
        const name = Name.create(inputName);
        const email = Email.create(inputEmail);
        const cpf = CPF.create(inputCPF);
        const plate = inputPlate ? Plate.create(inputPlate) : null;
        return new Account(id, name, email, cpf, isPassanger, plate);
    }
}