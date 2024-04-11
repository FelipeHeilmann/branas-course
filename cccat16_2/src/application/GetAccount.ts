import IAccountDAO from "../driven/AccountDAO";

export default class GetAccount{
    constructor(readonly accountDAO: IAccountDAO){}

    async execute(input: any) {
        const account = await this.accountDAO.getAccountById(input.accountId);
        return account;
    }
}