import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { singleton } from '@keenondrums/singleton'

import { RabbitMQClient } from '@/rabbitmq/client'
import { RedisClient } from '@/redis/client'
import { config } from '@/config'
import messageRouter from '@/router/message'

@singleton
class App {
  private app: Application
  private brokerClient: RabbitMQClient
  private dbClient: RedisClient

  constructor(private port: string) {
    this.app = express()
    this.dbClient = new RedisClient()
    this.brokerClient = new RabbitMQClient()
  }

  private async configurate() {
    await this.brokerClient.initialize()
    await this.dbClient.initialize()

    this.app.use(bodyParser.json())
  }

  private setupRoutes() {
    this.app.use('/messages', messageRouter)
  }

  public async start() {
    await this.configurate()
    this.setupRoutes()

    this.app.listen(this.port, () => {
      console.log(
        `[server]: Service1 is running at http://localhost:${this.port}`
      )
    })
  }
}

const app = new App(config.port)
app.start()
