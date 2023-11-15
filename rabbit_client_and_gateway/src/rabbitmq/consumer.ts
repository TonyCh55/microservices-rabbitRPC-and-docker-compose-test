import { EventEmitter } from 'events'
import { Channel, ConsumeMessage } from 'amqplib'

export class Consumer {
  constructor(
    private channel: Channel,
    private consumeFrom: string,
    private eventEmitter: EventEmitter
  ) {}

  public consumeMessages() {
    try {
      this.channel.consume(
        this.consumeFrom,
        (msg: ConsumeMessage) => {
          this.eventEmitter.emit(msg.properties.correlationId, msg)
        },
        {
          noAck: true,
        }
      )
    } catch (err) {
      console.error('Consumer: Error in consumer', err)
    }
  }
}
