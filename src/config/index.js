import uuid from 'uuid/v4'
import dotenv from 'dotenv'
import { name, version } from '../../package.json'

dotenv.config()

const hostname =
  process.env.HOSTNAME || `${name}:${version}:${process.env.NODE_ENV}`

const config = {
  server: {
    host: process.env.KOA_HOST || '0.0.0.0',
    port: process.env.KOA_PORT || '3000',
    stack: !!process.env.KOA_STACK,
    debug: !!process.env.KOA_DEBUG,
    accessLogs: !!process.env.KOA_ACCESS_LOGS,
    hostname,
    namespace: process.env.KOA_NAMESPACE || uuid()
  },
  aws: {
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION
    }
  },
  optimization: {
    host: process.env.OPTIMIZATION_URL
  },
  jaegerConfig: {
    serviceName: `${name}`,
    reporter: {
      agentHost: process.env.HOSTNAME || 'localhost',
      agentPort: process.env.JAEGER_AGENT_PORT || '6832'
    },
    proxyTable: [
      {
        target: `http://localhost:${process.env.NODE_ENV || '3000'}`,
        changeOrigin: true
      }
    ]
  },
  driveServer: {
    host: process.env.DRIVE_URL
  },
  omsServer: {
    host: process.env.OMS_URL
  }
}

export default config
