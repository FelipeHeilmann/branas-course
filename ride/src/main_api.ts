// main

import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter, HapiAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/http/AccountController";
import { PositionRepositoryDatabase } from "./infra/repository/PostionRepostiory";

const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
const connection = new PgPromiseAdapter();
const mailerGateway = new MailerGatewayMemory();
httpServer.listen(3000);