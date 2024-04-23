
// Unit Test

import CPF from "../src/domain/vo/CPF";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve testar um cpf válido: %s", function (cpf: any) {
	expect(new CPF(cpf)).toBeDefined();
});

test.each([
	undefined,
	null,
	"11111111111",
	"123",
	"1234566789123456789"
])("Deve testar um cpf inválido: %s", function (cpf: any) {
	expect(() => new CPF(cpf)).toThrow(new Error("Invalid cpf"));
});