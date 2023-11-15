import { Channel, Connection, connect } from 'amqplib'
import { singleton } from '@keenondrums/singleton'

import { config } from '@/config'
import { OutputMessage } from '@/types'
import { Consumer } from './consumer'
import { Producer } from './producer'

@singleton
export class RabbitMQClient {
  producer: Producer

  private async createConnection() {
    const connection = await connect({
      hostname: config.rabbitMQ.host,
      port: config.rabbitMQ.port,
    })

    connection.on('error', (err) => {
      console.error('RabbitClient Connection error:', err.message)
    })

    connection.on('close', (err) => {
      console.warn('RabbitClient Connection closed:', err.message)
    })

    return connection
  }

  private async createChannels(
    connection: Connection
  ): Promise<[Channel, Channel]> {
    const producerChannel = await connection.createChannel()
    const consumerChannel = await connection.createChannel()

    return [producerChannel, consumerChannel]
  }

  public async initialize() {
    try {
      const connection = await this.createConnection()
      const [producerChannel, consumerChannel] =
        await this.createChannels(connection)

      const { queue: rpcQueue } = await consumerChannel.assertQueue(
        config.rabbitMQ.rpcQueue,
        {
          exclusive: true,
        }
      )

      this.producer = new Producer(producerChannel)
      const consumer = new Consumer(consumerChannel, rpcQueue)

      consumer.consumeMessages()
    } catch (err) {
      console.error('RabbitMQ client error', err)
    }
  }

  public send(msg: OutputMessage, correlationId: string, produceTo: string) {
    this.producer.produceMessage(msg, correlationId, produceTo)
  }
}
