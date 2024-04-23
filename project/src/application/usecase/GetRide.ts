import { AccountRepository } from "../../infra/repository/AccountRepository"
import crypto from "crypto";
import RideRepository from "../../infra/repository/RideRepository";
import { StringMap } from "ts-jest";

export default class GetRide {

	constructor (readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {
	}
	
	async execute (input: Input): Promise<Output> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		const passenger = await this.accountRepository.getAccountById(ride.passengerId);
		let driver;
		if(ride.getDriverId() !== null) {
			driver = await this.accountRepository.getAccountById(ride.getDriverId()!)
		}
		return {
			rideId: ride.rideId,
			passengerId: ride.passengerId,
			fromLat: ride.getFromLat(),
			fromLong: ride.getFromLong(),
			toLat: ride.getToLat(),
			toLong: ride.getToLong(),
			status: ride.getStatus(),
			passengerName: passenger.getName(),
			passengerEmail: passenger.getEmail(),
			driverEmail: driver?.getEmail(),
			driverName: driver?.getName()
		}
	}
}

// DTO
type Input = {
	rideId: string
}

// DTO
type Output = {
	rideId: string,
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	status: string,
	passengerName: string,
	passengerEmail: string,
	driverName?: string ,
	driverEmail?: string
}