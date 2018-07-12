import { Room } from './Room';
import { ChatMessage } from './ChatMessage';

export class ChatRoom extends Room {
    private messages: ChatMessage[];
    constructor(id: string) {
        super(id);
        this.messages = [];
    }

    addMsg(id: string, msg: string) {
        const m = new ChatMessage(id, msg);
        this.messages.push(m);
    }
    getMsg() {
        return this.messages;
    }
}
