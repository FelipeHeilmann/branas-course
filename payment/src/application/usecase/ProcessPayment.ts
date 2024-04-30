export default class ProcessPayment {
    constructor(){
    }

    async execute(input: Input): Promise<void> {
        console.log("Ride: " + input.rideId + " total: " + input.amount);
    }
}

type Input = {
    rideId: string,
    amount: number
}