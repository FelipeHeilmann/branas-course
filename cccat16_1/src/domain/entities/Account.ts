import { CPF } from "./CPF"
import { Email } from "./Email"
import { Name } from "./Name"
import { Plate } from "./Plate"

export default abstract class {
    readonly id: string
    readonly name: Name
    readonly email: Email
    readonly cpf: CPF
    readonly isPassenger: boolean
    readonly isDriver: boolean
    readonly carPlate: Plate | null

    constructor(id: string, name: Name, email: Email, cpf: CPF, isPassanger: boolean, plate: Plate | null){
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.isPassenger = isPassanger;
        this.isDriver = !isPassanger;
        this.carPlate = plate;
    }
}