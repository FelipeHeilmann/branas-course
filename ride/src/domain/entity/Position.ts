import Coord from "../vo/Coord";
import crypto from "node:crypto";

export default class Position {
    coord: Coord
    constructor(readonly positionId: string, readonly rideId: string ,lat: number, long: number, readonly date: Date){
        this.coord = new Coord(lat, long)
    }

    static create(rideId: string, lat: number, long: number, date: Date) {
        const positionId = crypto.randomUUID();
        return new Position(positionId, rideId ,lat, long, date);
    }
}