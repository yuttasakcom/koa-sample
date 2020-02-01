import '@babel/polyfill'
import http from 'http'
import { resolve } from 'path'

import koa from 'koa'
import bodyParser from 'koa-bodyparser'
import shutdown from 'koa-graceful-shutdown'
import { load } from '@spksoft/koa-decorator'

import config from './config'
import errorHandler from './middleware/errorHandler'

const app = new koa()
const PORT = config.server.port
const HOST = config.server.host
const server = http.createServer(app.callback())
const router = load(resolve(__dirname, 'controllers'), 'controller.js')

app.use(shutdown(server))
app.use(bodyParser())
app.use(errorHandler())

app.use(router.routes())
app.use(router.allowedMethods())

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})

export default server
