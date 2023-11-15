import { RabbitMQClient } from '@/rabbitmq/client'
import { Message, BrokerResponseMessage } from '@/types'

export interface IMessageSender {
  sendSync(msg: Message): Promise<BrokerResponseMessage>
  sendAsync(msg: Message): string
}

export class MessageSender implements IMessageSender {
  constructor(private brokerClient: RabbitMQClient) {}

  public sendSync(msg: Message) {
    try {
      return this.brokerClient.sendSync(msg)
    } catch (err) {
      console.error('MessageSender: Error in sendSync', err)
    }
  }

  public sendAsync(msg: Message) {
    try {
      return this.brokerClient.sendAsync(msg)
    } catch (err) {
      console.error('MessageSender: Error in sendAsync', err)
    }
  }
}
