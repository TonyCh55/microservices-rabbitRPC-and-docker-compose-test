import { singleton } from '@keenondrums/singleton'

import { RedisClient } from '@/redis/client'
import { RabbitMQClient } from '@/rabbitmq/client'
import { OutputMessage, InputMessage } from '@/types'

@singleton
export class ResponseHandler {
  private static brokerClient: RabbitMQClient
  private static bdClient: RedisClient

  constructor(brokerClient: RabbitMQClient, bdClient: RedisClient) {
    ResponseHandler.brokerClient = brokerClient
    ResponseHandler.bdClient = bdClient
  }

  public static handle(
    message: InputMessage,
    correlationId: string,
    replyTo: string
  ) {
    const response: OutputMessage = {
      id: correlationId,
      operation: message.operation,
    }

    setTimeout(async () => {
      this.brokerClient.send(response, correlationId, replyTo)

      this.bdClient.set(correlationId, {
        ...response,
        status: 'handled',
      })
    }, 10000)
  }
}
