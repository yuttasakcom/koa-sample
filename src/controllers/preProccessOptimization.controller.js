import { route, HttpMethod } from '@spksoft/koa-decorator'

import validate from './preProcessOptimization.validate'
import preProcessOptimizationService from '../services/preProcessOptimization.service'

@route('/pre-process-optimization')
class PreProcessOptimization {
  @route('/', HttpMethod.POST)
  async create(ctx) {
    const input = ctx.request.body

    /**
     * validate(input) is validation request params
     *
     * @param {Object} input - ctx.request.body
     * @description
     * areaCode is required string
     * appointmentDate is required string
     * @return
     * success void
     * fail throw new BadRequest
     */
    await validate(input)

    /**
     * preProcessOptimizationService serve input for Optimization
     * @description
     * make input for Optimization
     */
    const service = new preProcessOptimizationService(ctx)
    const res = await service.makeInput(input)

    ctx.status = 201
    ctx.body = { data: res }
  }
}

export default PreProcessOptimization
