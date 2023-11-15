import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { singleton } from '@keenondrums/singleton'

import messageRouter from '@/routes/message'
import { RabbitMQClient } from '@/rabbitmq/client'
import { RedisClient } from '@/redis/client'
import { config } from '@/config'
import { swaggerDocs } from '@/utils/swagger'

@singleton
class App {
  private app: Application
  private brokerClient: RabbitMQClient
  private dbClient: RedisClient

  constructor(private port: number) {
    this.app = express()
    this.dbClient = new RedisClient()
    this.brokerClient = new RabbitMQClient()
  }

  private async configure() {
    await this.brokerClient.initialize()
    await this.dbClient.initialize()

    this.app.use(bodyParser.json())
    swaggerDocs(this.app, this.port)
  }

  private setupRoutes() {
    this.app.use('/messages', messageRouter)
  }

  public async start() {
    await this.configure()
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
