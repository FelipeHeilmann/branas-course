import AccountGateway from "../../application/gateway/AccountGateway";
import HttpClient from "../http/HttpClient";

export default class AccountGatewayHttp implements AccountGateway {
    constructor(readonly httpClient: HttpClient){
    }
    
    async signup(input: any): Promise<any> {
        const response = await this.httpClient.post("http://localhost:3002/signup", input);
        const account = response;
        return account;
    }
    
    async getAccountById(accountId: string): Promise<any> {
        const response = await this.httpClient.get(`http://localhost:3002/accounts/${accountId}`);
        const account = response;
        return account;
    }

    
}