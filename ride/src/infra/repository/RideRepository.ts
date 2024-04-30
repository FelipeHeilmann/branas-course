// interface adapter

import Ride from "../../domain/entity/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
	connection: DatabaseConnection;
	saveRide (ride: Ride): Promise<void>;
	updateRide(ride: Ride): Promise<void>;
	hasActiveRideByPassengerId (passengerId: string): Promise<boolean>;
	getRideById (rideId: string): Promise<Ride>;
}

export class RideRepositoryDatabase implements RideRepository {

	constructor (readonly connection: DatabaseConnection) {
	}

	async saveRide(ride: Ride): Promise<void> {
		await this.connection.query("insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, distance, fare, last_lat, last_long) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [ride.rideId, ride.passengerId, ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.getStatus(), ride.date, ride.getDistance(), ride.getFare() ,ride.getLastLat(), ride.getLastLong()]);
	}

	async updateRide(ride: Ride): Promise<void> {
		await this.connection.query("update cccat16.ride set status = $1, distance = $2, fare = $3, last_lat = $4, last_long = $5, driver_id = $6", [ride.getStatus(), ride.getDistance(), ride.getFare(), ride.getLastLat(), ride.getLastLong(), ride.getDriverId()]);
	}

	async getRideById(rideId: string): Promise<any> {
		const [rideData] = await this.connection.query("select * from cccat16.ride where ride_id = $1", [rideId]);
		return Ride.restore(rideData.ride_id, rideData.passenger_id, rideData.driver_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date, parseFloat(rideData.distance), parseFloat(rideData.fare) ,parseFloat(rideData.last_lat), parseFloat(rideData.last_long));
	}

	async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
		const [rideData] = await this.connection.query("select * from cccat16.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
		return !!rideData;
	}

}