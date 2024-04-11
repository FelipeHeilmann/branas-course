export interface IMailerGateway {
	send (recipient: string, subject: string, content: string): Promise<void>;
}

// Driven/Resource Adapter
export class MailerGatewayMemory implements IMailerGateway {

	async send(recipient: string, subject: string, content: string): Promise<void> {
		console.log(recipient, subject, content);
	}

}