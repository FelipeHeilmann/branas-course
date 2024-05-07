import amqp from "amqplib";

export default interface Queue {
    connect(): Promise<void>;
    publish(exchange: string, data: any): Promise<void>;
    consume(queue: string, callback: Function): Promise<void>;
    setup(): Promise<void>
}

export class RabbitMQAdapter implements Queue {
    connection: any

    constructor() {
    }

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
    }

    async publish(exchange: string, data: any): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
    }

    async consume(queue: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
        channel.consume(queue, async (msg: any) => {
            const input = JSON.parse(msg.content.toString());
			await callback(input);
			await channel.ack(msg);
        })
    }

    async setup(): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertExchange("rideCompleted", "direct", { durable: true });
        await channel.assertQueue("rideCompleted.processPayment", { durable: true });
        await channel.bindQueue("rideCompleted.processPayment", "rideCompleted", "");
    
    }

}