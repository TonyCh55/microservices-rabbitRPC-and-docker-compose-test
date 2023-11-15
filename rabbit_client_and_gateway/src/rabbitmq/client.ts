import { singleton } from '@keenondrums/singleton'
import { connect, Channel, Connection } from 'amqplib'
import { EventEmitter } from 'events'

import { config } from '@/config'
import { Message, BrokerResponseMessage } from '@/types'
import { Consumer } from './consumer'
import { Producer } from './producer'

interface BrokerClientOperttions {
  initialize(): Promise<void>
  sendSync(msg: Message): Promise<BrokerResponseMessage>
  sendAsync(msg: Message): string
}

@singleton
export class RabbitMQClient implements BrokerClientOperttions {
  private producer: Producer
  private eventEmitter: EventEmitter

  constructor() {
    this.eventEmitter = new EventEmitter()
  }

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

      const { queue: replyQueue } = await consumerChannel.assertQueue(
        config.rabbitMQ.replyQueue,
        {
          exclusive: true,
        }
      )

      const produceTo = config.rabbitMQ.rpcQueue
      const replyTo = replyQueue
      this.producer = new Producer(
        producerChannel,
        produceTo,
        replyTo,
        this.eventEmitter
      )

      const consumeFrom = replyQueue
      const consumer = new Consumer(
        consumerChannel,
        consumeFrom,
        this.eventEmitter
      )

      consumer.consumeMessages()
    } catch (err) {
      console.error('RabbitMQClient error', err)
    }
  }

  public async sendSync(msg: Message) {
    try {
      return await this.producer.produceMessageSync(msg)
    } catch (error) {
      console.error('RabbitMQClient: Error in sendSync:', error)
    }
  }

  public sendAsync(msg: Message) {
    try {
      return this.producer.produceMessageAsync(msg)
    } catch (error) {
      console.error('RabbitMQClient: Error in sendAsync:', error)
    }
  }
}
