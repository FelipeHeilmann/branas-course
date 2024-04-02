import Driver from "../entities/Driver";
import Pessanger from "../entities/Passenger";

export class AccountFactory{
    static create(name: string, email: string, cpf: string, isPessenger: boolean, plate?: string){
        if(isPessenger) return Pessanger.create(name, email, cpf);
        return Driver.create(name, email, cpf, plate!)
    }

    static restore(id: string, name: string, email: string, cpf: string, isPessenger: boolean, plate: string | null){
        if(isPessenger) return Pessanger.restore(id, name, email, cpf);
        return Driver.restore(id,name, email, cpf, plate!)
    }
}