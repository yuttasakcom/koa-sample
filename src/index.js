import '@babel/polyfill'
import http from 'http'
import { resolve } from 'path'

import koa from 'koa'
import shutdown from 'koa-graceful-shutdown'
import { load } from '@spksoft/koa-decorator'
import bodyParser from 'koa-bodyparser'
import config from './config'
import errorHandler from './middlewares/errorHandler'

const app = new koa()
const server = http.createServer(app.callback())
const PORT = process.env.PORT || '3000'
const HOST = process.env.HOST || '0.0.0.0'
const router = load(resolve(__dirname, 'controllers'), 'controller.js')

app.use(shutdown(server))
app.use(bodyParser())
app.use(errorHandler())

app.use(router.routes())
app.use(router.allowedMethods())

server.listen(config.server.port, config.server.host, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})
