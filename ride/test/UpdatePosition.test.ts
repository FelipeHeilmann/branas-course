import AcceptRide from "../src/application/usecase/AcceptRide";
import GetRideQuery from "../src/application/query/GetRideQuery";
import RequestRide from "../src/application/usecase/RequestRide";
import StartRide from "../src/application/usecase/StartRide";
import UpdatePosition from "../src/application/usecase/UpdatePosition";
import { PgPromiseAdapter, UnitOfWork } from "../src/infra/database/DatabaseConnection";
import { PositionRepositoryDatabase } from "../src/infra/repository/PostionRepostiory";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdatpter } from "../src/infra/http/HttpClient";

test("Deve atualizar a localização de uma corrida", async function() {
    const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const positionRepository = new PositionRepositoryDatabase(connection);
	const httpClient = new AxiosAdatpter();
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
	const unitOfWork = new UnitOfWork();
	const rideRepositoryUoW = new RideRepositoryDatabase(unitOfWork);
	const positionRepositoryUoW = new PositionRepositoryDatabase(unitOfWork);
	const updatePosition = new UpdatePosition(rideRepositoryUoW, positionRepositoryUoW);
    const inputUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
		long: -48.522234807851476,
		date: new Date("2021-03-01T12:00:00")
    };
    await updatePosition.execute(inputUpdatePosition);
    const outputGetRide = await getRideQuery.execute(inputGetRide);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("in_progress");
    expect(outputGetRide.driverName).toBe(inputSignupDriver.name);
    expect(outputGetRide.driverEmail).toBe(inputSignupDriver.email);
    expect(outputGetRide.lastLat).toBe(inputUpdatePosition.lat);
    expect(outputGetRide.lastLong).toBe(inputUpdatePosition.long);
	await connection.close(); 
});