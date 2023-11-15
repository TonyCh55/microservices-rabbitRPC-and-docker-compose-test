import { ClearDataModeType } from '@/types'
import { Request, Response } from 'express'

import { ClearDataModes } from '@/constants'
import { MessageService } from '@/services/message'

const messageService = new MessageService()

export class MessageController {
  public async sendSync(req: Request, res: Response) {
    try {
      const { operation } = req.body

      if (operation) {
        const msg = await messageService.sendSync({ operation })

        res.status(201).send({ operationId: msg.id })
      } else {
        res.status(400).send('Operation name is required!')
      }
    } catch (err) {
      console.error('MessageController: Error in sendSync', err)
      res.status(500).send('Somethig went wrong')
    }
  }

  public sendAsync(req: Request, res: Response) {
    try {
      const { operation } = req.body

      if (operation) {
        const operationId = messageService.sendAsync({ operation })

        res.status(201).send({ operationId })
      } else {
        res.status(400).send('Operation name is required!')
      }
    } catch (err) {
      console.error('MessageController: Error in sendAsync', err)
      res.status(500).send('Somethig went wrong')
    }
  }

  public async getOperationById(req: Request, res: Response) {
    try {
      const operation = await messageService.getById(req.params.id)

      if (operation) {
        res.status(200).send(operation)
      } else {
        res.status(404).send('Operation was not found')
      }
    } catch (err) {
      console.error('MessageController: Error in getOperationById', err)
      res.status(500).send('Somethig went wrong')
    }
  }

  public async clearData(req: Request, res: Response) {
    const responses = {
      [ClearDataModes.ASYNC]:
        'All processed operations data was deleted, but inprogress operations was not affected',
      [ClearDataModes.SYNC]: 'All operations data was deleted',
    }

    try {
      const { mode } = req.body

      if (mode === ClearDataModes.ASYNC || mode === ClearDataModes.SYNC) {
        await messageService.clearData(mode)

        res.status(200).send(responses[mode])
      } else {
        res.status(400).send('Mode required! ASYNC or SYNC')
      }
    } catch (err) {
      console.error('MessageController: Error in clearData', err)
      res.status(500).send('Somethig went wrong').send('Somethig went wrong')
    }
  }
}
