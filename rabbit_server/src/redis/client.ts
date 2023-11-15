import { singleton } from '@keenondrums/singleton'
import { createClient, RedisClientType } from 'redis'

import { config } from '@/config'

@singleton
export class RedisClient {
  private client: RedisClientType

  public async initialize(): Promise<void> {
    try {
      this.client = createClient({
        socket: config.redis.socket,
      })

      this.client.on('error', (err) => console.log('Redis Client Error', err))

      await this.client.connect()
    } catch (err) {
      console.error('RedisClient initialization erro')
    }
  }

  public async closeConnection(): Promise<void> {
    await this.client.disconnect()
  }

  public async set(key: string, value: any): Promise<void> {
    try {
      await this.client.hSet(key, value)
    } catch (err) {
      console.error('RedisClient setting error', err)
    }
  }

  public async get(key: any): Promise<void> {
    try {
      await this.client.get(key)
    } catch (err) {
      console.error('RedisClient getting error', err)
    }
  }
}
