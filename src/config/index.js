import uuid from 'uuid/v4'
import { name, version } from '../../package.json'

const config = {
  server: {
    host: process.env.KOA_HOST || '0.0.0.0',
    port: process.env.KOA_PORT || '3000',
    stack: !!process.env.KOA_STACK,
    debug: !!process.env.KOA_DEBUG,
    accessLogs: !!process.env.KOA_ACCESS_LOGS,
    hostname:
      process.env.HOSTNAME || `${name}:${version}:${process.env.NODE_ENV}`,
    namespace: process.env.KOA_NAMESPACE || uuid()
  }
}

export default config
