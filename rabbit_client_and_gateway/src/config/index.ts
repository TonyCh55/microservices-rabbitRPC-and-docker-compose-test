import dotenv from 'dotenv'

dotenv.config()

const {
  PORT,
  RABBIT_HOST,
  RABBIT_PORT,
  RPC_QUEUE_NAME,
  REPLY_QUEUE_NAME,
  REDIS_HOST,
  REDIS_PORT,
} = process.env

export const config = {
  port: Number(PORT),
  rabbitMQ: {
    host: RABBIT_HOST,
    port: Number(RABBIT_PORT),
    rpcQueue: RPC_QUEUE_NAME,
    replyQueue: REPLY_QUEUE_NAME,
  },
  redis: {
    socket: {
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
    },
  },
}
