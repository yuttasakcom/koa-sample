import axios from 'axios'
import { uploadJsonToS3 } from '../libraries/s3'

import config from '../config'

class preProcessOptimization {
  DISTANCE_MODE = 'DISTANCE'
  BUCKET_NAME = 'staging-route-optimization'
  ROUTE_OPTIMIZE_FILE_URI = 'route-optimization/file'
  s3FolderName = ''

  /**
   * makeInput
   * @description
   * make input for optimization
   * @param {Object} input -
   * - areaCode String
   * - appointmentDate String
   */
  async makeInput(input) {
    const { orders, staffs } = await this.getOrdersAndStaffs(input)
    const generateInput = await this.generateInput(orders, staffs)
    return generateInput
    // const uploaded = await this.uploadJson(generateInput)
    // await this.callOptimization(uploaded)
  }

  async getOrdersAndStaffs(input) {
    try {
      const { areaCode, appointmentDate } = input
      const [orders, staffs] = await Promise.all([
        this.getOrders({ areaCode }),
        this.getStaffs({ areaCode })
      ])
      console.log('getOrdersAndStaffs finished')
      return { orders, staffs }
    } catch (error) {
      console.error(`getOrdersAndStaffs error: ${error}`)
    }
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
            ...orders.map(o => ({
              start: 900,
              end: 1000
            }))
          ],
          penalties: [...staffs.map(s => 0), ...orders.map(o => 200)],
          allow_vehicles: []
        },
        vehicles: {
          ids: ['56eac3ea-d06e-461c-9d4c-915a604a78e6'],
          capacities: [6],
          starts: [0],
          ends: [0]
        },
        distance_matrix: [
          [0, 1496],
          [1496, 0]
        ]
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
        this.BUCKET_NAME,
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
        `${config.optimization.host}/${this.ROUTE_OPTIMIZE_FILE_URI}`,
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
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    )
    return data
  }

  /**
   * @todo Refactor code
   * */
  async getStaffs({ areaCode, appointmentDate }) {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    )
    return data
  }
}

export default preProcessOptimization
