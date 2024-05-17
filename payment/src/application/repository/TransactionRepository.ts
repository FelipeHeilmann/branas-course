import Transaction from "../../domain/Transaction";

export default interface TransactionRepository {
    get(transactionId: string): Promise<Transaction>;
    save(transaction: Transaction): Promise<void>;
}