import { AccountRepository } from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
    constructor(readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository){
    }

    async execute(input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const account = await this.accountRepository.getAccountById(input.driverId);
        if(!account.isDriver) throw new Error("The account is not a driver account");
        ride.accept(account.accountId);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    driverId: string
}