import express from "express";
import { Signup } from "./application/usecase/Signup";
import { AccountRepositoryDatabase } from "./infra/repositories/AccountRepositoryDatabase";
import GetAccount from "./application/usecase/GetAccount";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const accountRepository = new AccountRepositoryDatabase(); 
	const signup = new Signup(accountRepository);
	try{
		const result = await signup.execute(req.body); 
		return res.status(201).send(result);
	}
	catch(err: any){
		return res.status(422).json({
			message: err.message
		});
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountRepository = new AccountRepositoryDatabase(); 
	const getAccount = new GetAccount(accountRepository);
	try{
		const result = await getAccount.execute(req.params.accountId); 
		return res.status(200).send(result);
	}
	catch(err: any){
		return res.status(404).json({
			message: err.message
		});
	}
});

app.listen(3000);
