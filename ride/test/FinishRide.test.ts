import AcceptRide from "../src/application/usecase/AcceptRide";
import FinishRide from "../src/application/usecase/FinishRide";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import { Signup } from "../src/application/usecase/Signup";
import StartRide from "../src/application/usecase/StartRide";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Registry from "../src/infra/di/Registry";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import PaymentGatewayHttp from "../src/infra/gateway/PaymentGatewayHttp";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { PositionRepositoryDatabase } from "../src/infra/repository/PostionRepostiory";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

test("Deve finalizar uma corrida", async function() {
    const connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	const rideRepository = new RideRepositoryDatabase(connection);
	const positionRepository = new PositionRepositoryDatabase(connection);
	const paymentGateway = new PaymentGatewayHttp();
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(accountRepository, mailerGateway);
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
        carPlate: "AAA9999",
		isDriver: true
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const requestRide = new RequestRide(accountRepository, rideRepository);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const getRide = new GetRide(accountRepository, rideRepository);
	const inputGetRide = {
		rideId: outputRequestRide.rideId
	};
	const accepetRide = new AcceptRide(rideRepository, accountRepository);
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
	registry.provide("rideRepository", rideRepository);
	registry.provide("paymentGateway", paymentGateway);
	const finishRide = new FinishRide();
	const inputFinishRide = {
		rideId: outputRequestRide.rideId
	};
	await finishRide.execute(inputFinishRide);
    const outputGetRide = await getRide.execute(inputGetRide);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("completed");
	expect(outputGetRide.fare).toBe(63);
	expect(outputGetRide.distance).toBe(20);
	await connection.close(); 
});