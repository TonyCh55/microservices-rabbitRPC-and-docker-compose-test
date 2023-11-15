import { Router } from 'express'

import { MessageController } from '@/controllers/message'

const router = Router()
const messageController = new MessageController()

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - operation
 *       properties:
 *         operation:
 *           type: string
 *           description: Name of the operation
 *       example:
 *         operation: some operation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OperationStatusData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         operation:
 *           type: string
 *           description: Name of the operation
 *         status:
 *           type: string
 *         mode:
 *           type: string
 *           description: in what mode the operation was created
 *       example:
 *         operation: some operation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClearBody:
 *       type: object
 *       required:
 *         - mode
 *       properties:
 *         mode:
 *           type: string
 *           description: Mode of clear ASYNC or SYNC
 *       example:
 *         mode: ASYNC
 */

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: The messages managing API
 */

/**
 * @swagger
 * /messages/sync:
 *   post:
 *     summary: Returns the id of the operation (waits till operation is executed with status handled)
 *     tags: [Messages]
 *     responses:
 *       201:
 *         description: The operation id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.post('/sync', messageController.sendSync)

/**
 * @swagger
 * /messages/async:
 *   post:
 *     summary: Returns the id of the operation (do not wait till operation is executed with status handled)
 *     tags: [Messages]
 *     responses:
 *       201:
 *         description: The operation id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.post('/async', messageController.sendAsync)

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Returns the operation satus data
 *     tags: [Messages]
 *     parameters:
 *      - id: Operation id
 *        required: true
 *     responses:
 *       200:
 *         description: The operation status data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/OperationStatusData'
 */
router.get('/:id', messageController.getOperationById)

/**
 * @swagger
 * /messages/clear:
 *   post:
 *     summary: Returns the text message
 *     tags: [Messages]
 *     responses:
 *       201:
 *         description: ASYNC mode do not delete inprogress operations, SYNC mode deletes all
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/ClearBody'
 */
router.post('/clear', messageController.clearData)

export default router
