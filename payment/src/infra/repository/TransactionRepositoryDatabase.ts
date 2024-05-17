import TransactionRepository from "../../application/repository/TransactionRepository";
import Transaction from "../../domain/Transaction";
import DatabaseConnection from "../database/DatabaseConnection";

export default class TransactionRepositoryDatabase implements TransactionRepository {
    constructor(readonly conection: DatabaseConnection){
    }
    
    async get(transactionId: string): Promise<Transaction> {
        const [transactionData] = await this.conection.query("select * from cccat16.transaction where transaction_id = $1", [transactionId]);
        if(!transactionData) throw new Error("Transaction not found");
        return new Transaction(transactionData.transaction_id, transactionData.ride_id, parseFloat(transactionData.amount), transactionData.date ,transactionData.status);
    }

    async save(transaction: Transaction): Promise<void> {
        await this.conection.query("insert into cccat16.transaction (transaction_id, ride_id, status, date, amount) values ($1, $2, $3, $4, $5)", [transaction.transactionId, transaction.rideId, transaction.getStatus(), transaction.date ,transaction.amount])
    }
}