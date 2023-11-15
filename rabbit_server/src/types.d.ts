export interface InputMessage {
  operation: string
}

export interface OutputMessage {
  operation: string
  id: string
}

export interface ConsumerResult {
  msg: OutputMessage
  produceTo: string
}
