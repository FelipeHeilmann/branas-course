import { Signup } from "../src/application/usecase/Signup";
import AccountRepositoryMemory from "../src/infra/repositories/AccountRepositoryMemory"

test("Deve cria uma conta para passageiro", async function(){
    const accountRepository = new AccountRepositoryMemory();
    const signup = new Signup(accountRepository);
    const input = {
		name: "John Doe",
		email: `joe.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true	
	};
    const output = await signup.execute(input);
    expect(output.accountId).toBeDefined();
});

test("Deve cria uma conta para motorista", async function(){
    const accountRepository = new AccountRepositoryMemory();
    const signup = new Signup(accountRepository);
    const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "DDD6333"
	};
    const output = await signup.execute(input);
    expect(output.accountId).toBeDefined();
});
