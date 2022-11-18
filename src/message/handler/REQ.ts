import { Message } from '#src/Message';

export default function(callback: (message: Message) => void, message: Message) {
	console.log('REQ');
	callback(message);
}
