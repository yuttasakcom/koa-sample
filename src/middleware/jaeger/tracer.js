import { initTracer } from 'jaeger-client'
import config from '../../config'

const { jaegerConfig } = config

const options = {
  serviceName: jaegerConfig.serviceName,
  sampler: {
    type: 'const',
    param: 1
  },
  reporter: jaegerConfig.reporter
}

export default initTracer(options, {})
