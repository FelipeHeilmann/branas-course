import crypto from "crypto";
import Coord from "../vo/Coord";
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import Segment from "../vo/Segment";
import { FareCalculatorFactory } from "../service/FareCalculator";
import Observable from "../../infra/mediator/Observable";
import RideCompleted from "../event/RideCompleted";

export default class Ride extends Observable {
	status: RideStatus

	private constructor (readonly rideId: string, readonly passengerId: string, public driverId: string | null, private segment: Segment, status: string, readonly date: Date, private distance: number, private fare: number, private lastPosition: Coord) {
		super();
		this.status = RideStatusFactory.create(this, status);
	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const status = "requested";
		const date = new Date();
		return new Ride(rideId, passengerId, null, new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)), status, date, 0, 0, new Coord(fromLat, fromLong));
	}

	static restore (rideId: string, passengerId: string, driverId: string | null, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string,date: Date, distance: number, fare: number, lastLat: number, lasLong: number) {
		return new Ride(rideId, passengerId, driverId, new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)), status, date, distance, fare ,new Coord(lastLat, lasLong));
	}

	accept (driverId: string) {
		this.status.accept();
		this.driverId = driverId;
	}

	start () {
		this.status.start();
	}

	finish () {
		this.status.finish();
		this.notify(new RideCompleted({ rideId: this.rideId, amount: this.fare }))
	}

	updatePosition (lat: number, long: number, date: Date) {
		const newPosition = new Coord(lat, long);
		const distance = new Segment(this.lastPosition, newPosition).getDistance();
		this.distance += distance;
		this.fare += FareCalculatorFactory.create(date).calculate(distance);
		this.lastPosition = newPosition;
	}

	getStatus () {
		return this.status.value;
	}

	getDriverId() {
		return this.driverId;
	}

	getFare () {
		return this.fare;
	}

	getDistance () {
		return this.distance;
	}

	getLastLat() {
		return this.lastPosition.getLat();
	}

	getLastLong() {
		return this.lastPosition.getLong();
	}

	getFromLat () {
		return this.segment.from.getLat();
	}

	getFromLong () {
		return this.segment.from.getLong();
	}

	getToLat () {
		return this.segment.to.getLat();
	}

	getToLong () {
		return this.segment.to.getLong();
	}
}