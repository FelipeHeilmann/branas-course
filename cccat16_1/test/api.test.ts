import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.data.accountId).toBeDefined();
});


test("Deve criar uma conta para um motorista", async function(){
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "DDD6333"
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.data.accountId).toBeDefined();
});

test("Não deve criar uma conta para um para passageiro devido a email em uso", async function(){
	const email = `john.doe${Math.random()}@gmail.com`;
	
	const input = {
		name: "John Doe",
		email: email,
		cpf: "87748248800",
		isPassenger: true	
	};

	await axios.post("http://localhost:3000/signup", {
		name: "John Doe",
		email: email,
		cpf: "87748248800",
		isPassenger: true,
	});

	expect(axios.post("http://localhost:3000/signup", input)).rejects.toThrow;
});
