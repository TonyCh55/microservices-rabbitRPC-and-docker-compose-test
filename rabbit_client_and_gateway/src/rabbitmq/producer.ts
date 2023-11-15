import { v4 as uuid } from 'uuid'
import { Channel } from 'amqplib'
import EventEmitter from 'events'

import { Message, BrokerResponseMessage } from '@/types'

export class Producer {
  constructor(
    private channel: Channel,
    private produceTo: string,
    private replyTo: string,
    private eventEmitter: EventEmitter
  ) {}

  private sendToQueue(msg: Message, id: string) {
    try {
      this.channel.sendToQueue(
        this.produceTo,
        Buffer.from(JSON.stringify(msg)),
        {
          replyTo: this.replyTo,
          correlationId: id,
          expiration: 10,
        }
      )
    } catch (err) {
      console.error('Error in producer', err)
    }
  }

  public async produceMessageSync(msg: Message) {
    try {
      const id = uuid()

      this.sendToQueue(msg, id)

      return new Promise<BrokerResponseMessage>((res) => {
        this.eventEmitter.once(id, async (msg) => {
          const reply = JSON.parse(msg.content)
          res(reply)
        })
      })
    } catch (err) {
      console.error('Producer: Error in produceMessageSync')
    }
  }

  public produceMessageAsync(msg: Message) {
    try {
      const id = uuid()

      this.sendToQueue(msg, id)

      return id
    } catch (err) {
      console.error('Producer: Error in produceMessageAsync')
    }
  }
}
