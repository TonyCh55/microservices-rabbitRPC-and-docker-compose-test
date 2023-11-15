import { RedisFlushModes } from '@redis/client/dist/lib/commands/FLUSHALL.js'

export enum OperationStatuses {
  handled = 'handled',
  pending = 'pending',
}

export enum OperationModes {
  sync = 'sync',
  async = 'async',
}

export enum ClearDataModes {
  SYNC = RedisFlushModes.SYNC,
  ASYNC = RedisFlushModes.ASYNC,
}
