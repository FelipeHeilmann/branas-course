import GetRideQuery from "../src/application/query/GetRideQuery";
import RequestRide from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../src/infra/gateway/AccountGatewayHttp";
import { AxiosAdatpter } from "../src/infra/http/HttpClient";

test("Deve solicitar uma corrida", async function () {
	const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const httpClient = new AxiosAdatpter();
	const accountGateway = new AccountGatewayHttp(httpClient);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const requestRide = new RequestRide(accountGateway, rideRepository);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
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
	const outputGetRide = await getRideQuery.execute(inputGetRide);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("requested");
	expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
	expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
	expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
	expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
	expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerEmail).toBe(inputSignup.email);
	await connection.close();
});

test("Não deve poder solicitar uma corrida se não for um passageiro", async function () {
	const connection = new PgPromiseAdapter();
    const databaseConnection = new PgPromiseAdapter();
	const httpClient = new AxiosAdatpter(); 
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const accountGateway = new AccountGatewayHttp(httpClient);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AAA9999",
		isDriver: true
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const requestRide = new RequestRide(accountGateway, rideRepository);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account is not from a passenger"));
	await connection.close();
});

test("Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa", async function () {
	const connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const httpClient = new AxiosAdatpter();
	const accountGateway = new AccountGatewayHttp(httpClient);
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const requestRide = new RequestRide(accountGateway, rideRepository);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger has an active ride"));
	await connection.close();
});