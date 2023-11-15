import { Channel, ConsumeMessage } from 'amqplib'

import { InputMessage, OutputMessage } from '@/types'
import { ResponseHandler } from '@/response_handler'

export class Consumer {
  constructor(
    private channel: Channel,
    private consumeFrom: string
  ) {}

  public consumeMessages() {
    try {
      this.channel.consume(
        this.consumeFrom,
        (message: ConsumeMessage) => {
          const { correlationId, replyTo } = message.properties

          if (!correlationId || !replyTo) {
            console.error('No correlationId or reply to')
          }

          const consumedMessage: InputMessage = JSON.parse(
            message.content.toString()
          )
          console.log('Consumed', consumedMessage)

          const outputMessage: OutputMessage = {
            ...consumedMessage,
            id: correlationId,
          }

          ResponseHandler.handle(outputMessage, correlationId, replyTo)
        },
        { noAck: true }
      )
    } catch (err) {
      console.error('Error in consumer', err)
    }
  }
}
