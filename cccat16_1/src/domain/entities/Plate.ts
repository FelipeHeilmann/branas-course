export class Plate {
    private value: string;

    private constructor(plate: string) {
        this.value = plate;
    }

    static create(plate: string) {
        if (!plate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid plate");
        return new Plate(plate);
    }

    getValue(){
        return this.value;
    }
}