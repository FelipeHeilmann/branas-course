import { validate } from "../src/validateCpf";

test.each([
    "71831338009",
    "47215678040",
    "18817076015",
    "88486143020"
])('Deve testar um cpf válido', function (cpf: string) {
    const isValid = validate(cpf);
    expect(isValid).toBe(true);
})

test.each([
    "11111111111",
    "",
    null,
    undefined,
    "1231312312313123123"
])('Deve testar um cpf invalido', function (cpf: any) {
    const isValid = validate(cpf);
    expect(isValid).toBe(false);
})