import { route, HttpMethod } from '@spksoft/koa-decorator'

import validate from './preProcessOptimization.validate'

@route('/pre-process-optimization')
class PreProcessOptimization {
  @route('/', HttpMethod.POST)
  async create(ctx) {
    const input = ctx.request.body
    await validate(input)
    ctx.status = 201
    ctx.body = { msg: 'OK' }
  }
}

export default PreProcessOptimization
