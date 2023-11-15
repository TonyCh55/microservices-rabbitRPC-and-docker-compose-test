import { OperationModes, OperationStatuses, ClearDataModes } from './constants'

export interface Message {
  operation: string
}

export interface BrokerResponseMessage {
  id: string
  operation: string
}

export interface OutputDBMessage {
  id: string
  operation: 'string'
  status: keyof OperationStatuses
  mode: keyof OperationModes
}

export type ClearDataModeType = keyof ClearDataModes
