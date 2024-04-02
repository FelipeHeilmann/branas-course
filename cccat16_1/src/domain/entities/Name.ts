export class Name{
    value: string

    private constructor(name: string) {
        this.value = name;
    }

    static create(name: string) {
        if(!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name"); 
        return new Name(name);
    }

    getValue(){
        return this.value;
    }
}