import AcceptRide from "../src/application/usecase/AcceptRide";
import FinishRide from "../src/application/usecase/FinishRide";
import GetRideQuery from "../src/application/query/GetRideQuery";
import ProcessPayment from "../src/application/usecase/ProcessPayment";
import RequestRide from "../src/application/usecase/RequestRide";
import StartRide from "../src/application/usecase/StartRide";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Registry from "../src/infra/di/Registry";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdatpter, FetchAdapter } from "../src/infra/http/HttpClient";
import Mediator from "../src/infra/mediator/Mediator";
import { RabbitMQAdapter } from "../src/infra/queue/Queue";
import { PositionRepositoryDatabase } from "../src/infra/repository/PostionRepostiory";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

test("Deve finalizar uma corrida", async function() {
    const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const positionRepository = new PositionRepositoryDatabase(connection);
	const httpClient = new FetchAdapter();
	const accountGateway = new AccountGatewayHttp(httpClient);
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
    const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
        carPlate: "AAA9999",
		isDriver: true
	};
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
	const requestRide = new RequestRide(accountGateway, rideRepository);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const getRideQuery = new GetRideQuery(connection);
	const inputGetRide = {
		rideId: outputRequestRide.rideId
	};
	const accepetRide = new AcceptRide(rideRepository, accountGateway);
    const inputAccpetRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    };
    await accepetRide.execute(inputAccpetRide);
    const startRide = new StartRide(rideRepository);
    const inputStartRide = {
        rideId: outputRequestRide.rideId
    };
    await startRide.execute(inputStartRide);
    const updatePosition = new UpdatePosition(rideRepository, positionRepository);
	const inputUpdatePosition1 = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
		long: -48.522234807851476,
		date: new Date("2021-03-01T21:30:00")
    };
    await updatePosition.execute(inputUpdatePosition1);
	const inputUpdatePosition2 = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
		long: -48.545022195325124,
		date: new Date("2021-03-01T22:00:00")
    };
    await updatePosition.execute(inputUpdatePosition2);
	const registry = Registry.getInstance();
	const mediator = new Mediator()
	const queue = new RabbitMQAdapter();
	await queue.connect();
	await queue.setup();
	registry.provide("rideRepository", rideRepository);
	registry.provide("mediator", mediator);
	registry.provide("queue", queue);
	mediator.register("rideCompleted", async (data: any) => {
		const processPayment = new ProcessPayment();
		await processPayment.execute(data)
	})
	const finishRide = new FinishRide();
	const inputFinishRide = {
		rideId: outputRequestRide.rideId
	};
	await finishRide.execute(inputFinishRide);
    const outputGetRide = await getRideQuery.execute(inputGetRide);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("completed");
	expect(outputGetRide.fare).toBe(63);
	expect(outputGetRide.distance).toBe(20);
	await connection.close(); 
});