import express from "express";
import Signup from "../application/Signup";
import { AccountDAODatabase } from "../driven/AccountDAO";
import GetAccount from "../application/GetAccount";
import { MailerGatewayMemory } from "../driven/MailGateway";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	try{
		const mailerGateway = new MailerGatewayMemory()
		const accountDAO = new AccountDAODatabase();
		const signup = new Signup(accountDAO, mailerGateway);
		const ouput = await signup.execute(req.body);
	}catch(err: any){
		res.status(422).json({
			message: err.message
		})
	}
});

app.post("/accounts/:accountId", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO);
	const input = {
		accountId: req.params.accountId
	};
	const account = await getAccount.execute(input);
	res.json(account);
});


app.listen(3000);
