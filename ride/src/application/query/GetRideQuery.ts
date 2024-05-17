import DatabaseConnection from "../../infra/database/DatabaseConnection";
export default class GetRideQuery {

	constructor (readonly connection: DatabaseConnection) {
	}
	
	async execute (input: Input): Promise<Output> {
		const [ride] = await this.connection.query("select r.*, p.account_id as passenger_id, p.name as passenger_name, p.email as passenger_email, d.name as driver_name, d.email as driver_email from cccat16.ride r join cccat16.account p on (r.passenger_id = p.account_id) left join cccat16.account d on (r.driver_id = d.account_id) where ride_id = $1", [input.rideId]);
		
		return {
			rideId: ride.ride_id,
			passengerName: ride.passenger_name,
			passengerEmail: ride.passenger_email,
			driverName: ride.driver_name,
			driverEmail: ride.driver_email,
			status: ride.status,
			distance: parseFloat(ride.distance),
			fare: parseFloat(ride.fare),
			fromLat: parseFloat(ride.from_lat),
			fromLong: parseFloat(ride.from_long),
			lastLat: parseFloat(ride.last_lat),
			lastLong: parseFloat(ride.last_long),
			toLat: parseFloat(ride.to_lat),
			toLong: parseFloat(ride.to_long),
			passengerId: ride.passenger_id
		};
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