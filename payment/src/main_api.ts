import ProcessPayment from "./application/usecase/ProcessPayment";
import { ExpressAdapter } from "./infra/http/HttpServer";
import PaymentController from "./infra/http/PaymentController";

const httpServer = new ExpressAdapter();
const proccessPayment = new ProcessPayment();
new PaymentController(httpServer, proccessPayment);
httpServer.listen(3001)