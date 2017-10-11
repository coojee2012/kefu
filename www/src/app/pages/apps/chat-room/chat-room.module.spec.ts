import { ChatRoomModule } from './chat-room.module';

describe('ChatRoomModule', () => {
  let chatRoomModule: ChatRoomModule;

  beforeEach(() => {
    chatRoomModule = new ChatRoomModule();
  });

  it('should create an instance', () => {
    expect(chatRoomModule).toBeTruthy();
  });
});
