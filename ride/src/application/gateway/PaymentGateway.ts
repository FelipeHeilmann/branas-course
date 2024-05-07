export default interface PaymentGateway {
    processPayment(input: { rideId: string, amount: number }): Promise<void>
}