import { Router } from 'express'

import { MessageController } from '@/controllers/message'

const router = Router()
const messageController = new MessageController()

router.post('/sync', messageController.sendSync)
router.post('/async', messageController.sendAsync)
router.get('/:id', messageController.getOperationById)
router.post('/clear', messageController.clearData)

export default router
