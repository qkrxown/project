import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
//옵션 transports는 사용할 통신방법 명시된것 이외에 다 자름 , namespace: 채팅방 느낌으로 소속만 처리
// @WebSocketGateway(port,{옵션 transports:['websocket','polling']})
export class WebsocketGateway {
  // 모든 메세지에 대한 처리
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  @SubscribeMessage('event명')
  handleEvent(client: any, payload: any): string {
    //이벤트 처리로직
    return 'event 처리함';
  }
  

}
