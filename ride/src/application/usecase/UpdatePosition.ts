import Position from "../../domain/entity/Position";
import PositionRepository from "../../infra/repository/PostionRepostiory";
import RideRepository from "../../infra/repository/RideRepository";

export default class UpdatePosition {
    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {
    }

    async execute(input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.updatePosition(input.lat, input.long, input.date);
        await this.rideRepository.updateRide(ride);
        const position = Position.create(input.rideId, input.lat, input.long, input.date)
        await this.positionRepository.savePosition(position);
        await this.rideRepository.connection.commit();
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
    date: Date
}