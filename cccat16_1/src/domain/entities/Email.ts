export class Email{
    private value: string

    private constructor(name: string) {
        this.value = name;
    }

    static create(email: string) {
        if(!email.match(/^(.+)@(.+)$/)) throw new Error("Invalid Email"); 
        return new Email(email);
    }

    getValue(){
        return this.value;
    }
}