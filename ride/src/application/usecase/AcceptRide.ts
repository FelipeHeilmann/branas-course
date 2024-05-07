import RideRepository from "../../infra/repository/RideRepository";
import AccountGateway from "../gateway/AccountGateway";

export default class AcceptRide {
    constructor(readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway){
    }

    async execute(input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const account = await this.accountGateway.getAccountById(input.driverId);
        if(!account.isDriver) throw new Error("The account is not a driver account");
        ride.accept(account.accountId);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    driverId: string
}