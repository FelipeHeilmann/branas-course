import TransactionRepository from "../repository/TransactionRepository";

export default class GetTransaction {
    constructor(readonly transactionRepository: TransactionRepository){
    }

    async execute(transactionId: string): Promise<Output> {
        const transaction = await this.transactionRepository.get(transactionId);
        return {
            transactionId: transaction.transactionId,
            amount: transaction.amount,
            rideId: transaction.rideId,
            status: transaction.getStatus(),
            date: transaction.date
        };
    }
}

type Output = {
    transactionId: string
    rideId: string
    status: string
    amount: number
    date: Date
}