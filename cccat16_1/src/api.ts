import express from "express";
import { Signup } from "./application/usecase/Signup";
import { AccountRepositoryDatabase } from "./infra/repositories/AccountRepositoryDatabase";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const accountRepository = new AccountRepositoryDatabase(); 
	const signup = new Signup(accountRepository);
	try{
		const result = await signup.execute(req.body); 
		return res.status(201).send(result);
	}
	catch(err){
		return res.status(422).send(err);
	}
});

app.listen(3000);
