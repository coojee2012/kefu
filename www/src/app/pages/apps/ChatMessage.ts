export class ChatMessage {
    public id: string;
    public content: string;
    public from: string;
    public ts: number;
    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
        this.ts = new Date().getTime();
    }
}
