import RideRepository from "../../infra/repository/RideRepository";
import AccountGateway from "../gateway/AccountGateway";

export default class GetRide {

	constructor (readonly accountGateway: AccountGateway, readonly rideRepository: RideRepository) {
	}
	
	async execute (input: Input): Promise<Output> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		const passenger = await this.accountGateway.getAccountById(ride.passengerId);
		let driver;
		if(ride.driverId !== null) {
			driver = await this.accountGateway.getAccountById(ride.driverId);
		}
		return {
			rideId: ride.rideId,
			passengerId: ride.passengerId,
			fromLat: ride.getFromLat(),
			fromLong: ride.getFromLong(),
			toLat: ride.getToLat(),
			toLong: ride.getToLong(),
			status: ride.getStatus(),
			passengerName: passenger.name,
			passengerEmail: passenger.email,
			driverEmail: driver?.email,
			driverName: driver?.name,
			lastLat: ride.getLastLat(),
			lastLong: ride.getLastLong(),
			distance: ride.getDistance(),
			fare: ride.getFare()
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
	distance: number,
	fare: number,
	passengerName: string,
	passengerEmail: string,
	driverName?: string,
	driverEmail?: string,
	lastLat: number,
	lastLong: number,
}