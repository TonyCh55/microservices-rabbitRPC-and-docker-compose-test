import { RabbitMQClient } from '@/rabbitmq/client'
import { RedisClient } from '@/redis/client'
import {
  Message,
  OutputDBMessage,
  BrokerResponseMessage,
  ClearDataModeType,
} from '@/types'
import { OperationStatuses, OperationModes } from '@/constants'

export interface IMessageService {
  sendSync(msg: Message): Promise<BrokerResponseMessage>
  sendAsync(msg: Message): string
  getById(id: string): Promise<OutputDBMessage>
  clearData(mode: ClearDataModeType): Promise<void>
}

export class MessageService implements IMessageService {
  private brokerClient: RabbitMQClient
  private dbClient: RedisClient

  constructor() {
    this.dbClient = new RedisClient()
    this.brokerClient = new RabbitMQClient()
  }

  public async sendSync(msg: Message) {
    try {
      const result = await this.brokerClient.sendSync({
        operation: msg.operation,
      })

      await this.dbClient.set(result.id, {
        id: result.id,
        status: OperationStatuses.handled,
        mode: OperationModes.sync,
      })

      return result
    } catch (err) {
      console.error('MessageService: Error in sendSync', err)
    }
  }

  public sendAsync(msg: Message) {
    try {
      const operationId = this.brokerClient.sendAsync(msg)

      this.dbClient.set(operationId, {
        id: operationId,
        status: OperationStatuses.pending,
        mode: OperationModes.async,
      })

      return operationId
    } catch (err) {
      console.error('MessageService: Error in sendAsync', err)
    }
  }

  public async getById(id: string) {
    try {
      const operation = await this.dbClient.get(id)

      return operation as unknown as OutputDBMessage
    } catch (err) {
      console.error('MessageService: Error in getById', err)
    }
  }

  public async clearData(mode: ClearDataModeType) {
    try {
      await this.dbClient.clear(mode)
    } catch (err) {
      console.error('MessageService: Error in clearData', err)
    }
  }
}
