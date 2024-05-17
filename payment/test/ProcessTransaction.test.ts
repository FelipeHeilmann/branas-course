import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import crypto from "node:crypto"; 
import TransactionRepositoryDatabase from "../src/infra/repository/TransactionRepositoryDatabase";
import ProcessPayment from "../src/application/usecase/ProcessPayment";
import GetTransaction from "../src/application/usecase/GetTransaction";
import TransactionRepositoryORM from "../src/infra/repository/TransactionRepositoryORM";
import ORM from "../src/infra/orm/ORM";
import PJBankGateway from "../src/infra/gateway/PJBankGateway";

test("Deve criar uma transação", async function() {
    const connection = new PgPromiseAdapter();
    // const transactionRepository = new TransactionRepositoryDatabase(connection);
    const orm = new ORM(connection)
    const transactionRepository = new TransactionRepositoryORM(orm);
    const paymentGateway = new PJBankGateway();
    const proccessTransaction = new ProcessPayment(transactionRepository, paymentGateway);
    const input = {
        rideId: crypto.randomUUID(),
        amount: 100
    };
    const outputProccessTransaction = await proccessTransaction.execute(input);
    const getTransaction = new GetTransaction(transactionRepository);
    const outputGetTransaction = await getTransaction.execute(outputProccessTransaction.transactionId);
    expect(outputGetTransaction.amount).toBe(100);
    expect(outputGetTransaction.status).toBe("approved");
    await connection.close()
});