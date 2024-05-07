import DomainEvent from "../../domain/event/DomainEvent";
import Registry, { inject } from "../../infra/di/Registry";
import Mediator from "../../infra/mediator/Mediator";
import Queue from "../../infra/queue/Queue";
import RideRepository from "../../infra/repository/RideRepository";
import PaymentGateway from "../gateway/PaymentGateway";

export default class FinishRide {
    @inject("rideRepository")
    readonly rideRepository!: RideRepository
    @inject("mediator")
    readonly mediator!: Mediator
    @inject("queue")
    readonly queue!: Queue

    constructor() {
    }

    async execute(input: Input): Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.register("rideCompleted", async (event: DomainEvent) => {
            await this.queue.publish(event.eventName, event.data);
        });
        ride.finish();
        await this.rideRepository.updateRide(ride);
       
    }
}

type Input = {
    rideId: string,
}