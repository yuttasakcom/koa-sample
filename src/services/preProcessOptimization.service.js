import axios from 'axios'

import config from '../config'
import { uploadJsonToS3 } from '../libraries/s3'
import { NotFound } from '../errors/clientError'
import { InternalServerError } from '../errors/serverError'
import { distanceMatrix } from '../libraries/distanceMatrix'

const ROUTE_OPTIMIZE_FILE_URI = 'route-optimization/file'
const BUCKET_NAME = 'staging-route-optimization'
const OMS_URL = config.omsServer.host

class preProcessOptimization {
  DISTANCE_MODE = 'DISTANCE'
  errorMessage = ''

  constructor(ctx) {
    this.ctx = ctx
  }

  setErrorMessage(msg) {
    this.errorMessage = msg
  }

  /**
   * makeInput
   * @description
   * make input for optimization
   * @param {Object} input -
   * - areaCode String
   * - appointmentDate String
   */
  async makeInput(input) {
    const { orders } = await this.getOrdersAndStaffs(input)
    const generateInput = await this.generateInput(orders, [])
    return generateInput
    // const uploaded = await this.uploadJson(generateInput)
    // await this.callOptimization(uploaded)
  }

  async getOrdersAndStaffs(input) {
    const { areaCode, appointmentDate } = input
    const [orders] = await Promise.all([
      this.getOrders({ areaCode, appointmentDate })
    ])

    if (orders.length === 0) {
      this.setErrorMessage(
        `Orders in areaCode ${areaCode} at ${appointmentDate} not found`
      )
      console.error(this.errorMessage)
      throw new NotFound(this.errorMessage)
    }

    console.log('getOrdersAndStaffs finished')
    return { orders }
  }

  async generateInput(orders, staffs) {
    try {
      const input = {
        mode: this.DISTANCE_MODE,
        locations: {
          ids: [...staffs.map(s => `staff:${s.id}`), ...orders.map(o => o.id)],
          geo_locations: [
            ...staffs.map(s => s.address.geo),
            ...orders.map(o => o.address.geo)
          ],
          time_windows: [
            ...staffs.map(s => ({
              start: 800,
              end: 900
            })),
            ...orders.map(o => o.timeWindows)
          ],
          penalties: [...staffs.map(s => 0), ...orders.map(o => 200)],
          allow_vehicles: []
        },
        vehicles: {
          ids: [],
          capacities: [],
          starts: [],
          ends: []
        },
        distance_matrix: distanceMatrix(orders.map(o => o.address.geo))
      }
      console.log('generateInput finished')
      return input
    } catch (error) {
      console.error(`generateInput error: ${error}`)
    }
  }

  async setFolderName(dirName) {
    this.s3FolderName = dirName
    return this
  }

  async uploadJson(generateInput) {
    try {
      const s3Result = await uploadJsonToS3(
        BUCKET_NAME,
        '1',
        '2020-02-01.json',
        JSON.stringify(generateInput)
      )
      console.log('uploadJson finished')
      return s3Result
    } catch (error) {
      console.error(`uploadJson error: ${error}`)
      return
    }
  }

  async callOptimization(uploaded) {
    try {
      const optimizerParams = {
        debugMode: 'true',
        filePath: uploaded.Key,
        triggerEndpoint: 'http://example.com/callbackOptimize'
      }
      await axios.post(
        `${config.optimization.host}/${ROUTE_OPTIMIZE_FILE_URI}`,
        optimizerParams
      )
      console.log('callOptimization finished')
    } catch (error) {
      console.error(`callOptimization error: ${error}`)
    }
  }

  /**
   * @todo Refactor code
   * */
  async getOrders({ areaCode, appointmentDate }) {
    try {
      const query = `?search={"$and":[{"workflowInput.order.address.metadata.areaCode":{"$in":["${areaCode}"]}}, {"workflowInput.order.appointment.appointmentDate": "${appointmentDate}"},{"orderStatuses.status": "TRANSFORM_ORDER_SUCCESS"}]}&limit=5000`
      const { data } = await axios.get(`${OMS_URL}/v1/order${query}`)

      if (data.data.total === 0) {
        return []
      }

      const order = data.data.data.map(o => ({
        id: o.workflowInput.order.orderId,
        address: {
          geo: {
            lat: o.workflowInput.order?.address.feature.geometry.coordinates[1],
            lng: o.workflowInput.order?.address.feature.geometry.coordinates[0]
          }
        },
        timeWindows: {
          start: parseInt(
            (o.workflowInput.order?.appointment.timeslot.from)
              .split(':')
              .join('')
          ),
          end: parseInt(
            (o.workflowInput.order?.appointment.timeslot.to).split(':').join('')
          )
        }
      }))

      console.log('getOrders finished')
      return order
    } catch (error) {
      this.setErrorMessage('OMS api service unable to connect')
      console.error('getOrders fail')
      console.error(this.errorMessage)
      throw new InternalServerError(this.errorMessage)
    }
  }

  /**
   * @todo Refactor code
   * */
  async getStaffs({ areaCode, appointmentDate }) {
    const { data } = await axios.get('/users')
    return data
  }
}

export default preProcessOptimization
