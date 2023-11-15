import { Channel } from 'amqplib'

import { OutputMessage } from '@/types'

export class Producer {
  constructor(private channel: Channel) {}

  public produceMessage(
    message: OutputMessage,
    correlationId: string,
    produceTo: string
  ) {
    try {
      this.channel.sendToQueue(
        produceTo,
        Buffer.from(JSON.stringify(message)),
        {
          correlationId,
        }
      )
    } catch (err) {
      console.error('Error in producer')
    }
  }
}
