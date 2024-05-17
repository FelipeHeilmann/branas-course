import crypto from "node:crypto"

export default class Transaction {
    constructor(readonly transactionId: string, readonly rideId: string, readonly amount: number, readonly date: Date ,private status: string) {
    }

    static create(rideId: string, amount: number) {
        const transactionId = crypto.randomUUID();
        const status = "waiting_payment";
        const date = new Date();
        return new Transaction(transactionId, rideId, amount, date,status);
    }

    getStatus () {
        return this.status;
    }

    approve() {
        this.status = "approved";
    }

    reject() {
        this.status = "rejected";
    }
}