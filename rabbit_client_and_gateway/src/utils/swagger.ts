import { Request, Response, Application } from 'express'
import swaggerDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { config } from '@/config'
import { version } from '../../package.json'

const options: swaggerDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docss',
      version,
    },
  },
  servers: [{ url: `http://localhost:${config.port}` }],
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerDoc(options)

export const swaggerDocs = (app: Application, port: number) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  console.info(`Docs available at http://localhost:${port}/docs`)
}
