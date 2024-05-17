import AcceptRide from "../src/application/usecase/AcceptRide";
import GetRideQuery from "../src/application/query/GetRideQuery";
import RequestRide from "../src/application/usecase/RequestRide";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import { AxiosAdatpter } from "../src/infra/http/HttpClient";

test("Deve aceitar uma corrida", async function() {
    const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const httpClient = new AxiosAdatpter();
	const accountGateway = new AccountGatewayHttp(httpClient)
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
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
    const outputGetRide = await getRideQuery.execute(inputGetRide);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("accepted");
    expect(outputGetRide.driverName).toBe(inputSignupDriver.name);
    expect(outputGetRide.driverEmail).toBe(inputSignupDriver.email);
	await connection.close(); 
});