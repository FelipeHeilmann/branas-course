// interface adapter


import ProcessPayment from "../../application/usecase/ProcessPayment";
import HttpServer from "./HttpServer";

export default class PaymentController {

	constructor (readonly httpServer: HttpServer, readonly processPayment: ProcessPayment) {
		httpServer.register("post", "/payment", async function (params: any, body: any) {
			const output = await processPayment.execute(body);
			return output;
		});
	}
}