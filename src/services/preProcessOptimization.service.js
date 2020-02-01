import axios from 'axios'

import config from '../config'

class preProcessOptimization {
  DISTANCE_MODE = 'DISTANCE'
  ROUTE_OPTIMIZE_FILE_URI = 'route-optimization/file'

  /**
   * makeInput
   * @description
   * make input for optimization
   * @param {*} input
   * areaCode String |
   * appointmentDate String
   */
  async makeInput(input) {
    const { orders, staffs } = await this.getOrdersAndStaffs(input)
    const generateInput = await this.generateInput(orders, staffs)
    const uploaded = await this.uploadJsonToS3(generateInput)
    await this.callOptimization(uploaded)
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
      console.log('generateInput finished')
      return {
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
    } catch (error) {
      console.error(`generateInput error: ${error}`)
    }
  }

  async uploadJsonToS3(generateInput) {
    try {
      console.log('uploadJsonToS3 finished')
    } catch (error) {
      console.error(`uploadJsonToS3 error: ${error}`)
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
