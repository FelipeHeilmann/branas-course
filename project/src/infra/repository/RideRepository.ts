// interface adapter

import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
	saveRide (ride: Ride): Promise<void>;
	hasActiveRideByPassengerId (passengerId: string): Promise<boolean>;
	getRideById (rideId: string): Promise<Ride>;
}

export class RideRepositoryDatabase implements RideRepository {

	constructor (readonly connection: DatabaseConnection) {
	}

	async saveRide(ride: any): Promise<void> {
		await this.connection.query("insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date]);
	}

	async getRideById(rideId: any): Promise<any> {
		const [rideData] = await this.connection.query("select * from cccat16.ride where ride_id = $1", [rideId]);
		return Ride.restore(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date);
	}

	async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
		const [rideData] = await this.connection.query("select * from cccat16.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
		return !!rideData;
	}

}