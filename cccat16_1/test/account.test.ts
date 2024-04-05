import Account from "../src/domain/entities/Account";
import { CPF } from "../src/domain/entities/CPF";
import { Email } from "../src/domain/entities/Email";
import { Name } from "../src/domain/entities/Name";

test("Deve criar uma conta de passageiro valida", function(){
    const account = Account.create("Joe Doe", "joe.doe@gmail.com", "148.632.780-04", true, null);
    expect(account.isPassenger).toBe(true)
});

test("Deve criar uma conta de motorista valida", function(){
    const account = Account.create("Joe Doe", "joe.doe@gmail.com", "148.632.780-04", false,"AAA9999",);
    expect(account.isDriver).toBe(true)
});

test("Não deve criar um email válido", function(){
    expect(() => Email.create("joe.doe")).toThrow(new Error("Invalid Email"));
});

test("Não deve criar um nome válido", function(){
    expect(() => Name.create("Joe")).toThrow(new Error("Invalid Name"));
});

test.each([
    "11111111111",
    "",
    null,
    undefined,
    "1231312312313123123"
])("Não deve criar um cpf válido", function (cpf: any) {
    expect(() => CPF.create(cpf)).toThrow(new Error("Invalid CPF"));
})