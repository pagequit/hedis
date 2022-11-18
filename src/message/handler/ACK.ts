import { Message } from '#src/Message';

export default function(callback: (message: Message) => void, message: Message) {
	console.log('ACK');
	callback(message);
}
