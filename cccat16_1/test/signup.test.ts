import GetAccount from "../src/application/usecase/GetAccount";
import { Signup } from "../src/application/usecase/Signup";
import AccountRepositoryMemory from "../src/infra/repositories/AccountRepositoryMemory"

test("Deve cria uma conta para passageiro", async function(){
    const accountRepository = new AccountRepositoryMemory();
	const getAccount = new GetAccount(accountRepository);
    const signup = new Signup(accountRepository);
    const input = {
		name: "John Doe",
		email: `joe.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true	
	};
    const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});

test("Deve cria uma conta para motorista", async function(){
    const accountRepository = new AccountRepositoryMemory();
	const getAccount = new GetAccount(accountRepository);
    const signup = new Signup(accountRepository);
    const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "DDD6333"
	};
	const outputSignup = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
});
