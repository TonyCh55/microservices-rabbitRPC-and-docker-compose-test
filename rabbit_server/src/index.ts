import { singleton } from '@keenondrums/singleton'

import { RabbitMQClient } from '@/rabbitmq/client'
import { RedisClient } from '@/redis/client'
import { ResponseHandler } from '@/response_handler'

@singleton
class App {
  public async start() {
    const redisClient = new RedisClient()
    await redisClient.initialize()

    const rabbitClient = new RabbitMQClient()
    await rabbitClient.initialize()

    new ResponseHandler(rabbitClient, redisClient)
  }
}

const app = new App()
app.start()
