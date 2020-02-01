import axios from 'axios'

class preProcessOptimization {
  DISTANCE_MODE = 'DISTANCE'

  async makeInput(input) {
    const { orders, staffs } = await this.getOrdersAndStaffs(input)
    const generateInput = await this.generateInput(orders, staffs)
    const uploaded = await this.uploadJsonToS3(generateInput)
    await this.callOptimization(uploaded)
  }

  async callOptimization(uploaded) {
    console.log('callOptimization finished')
  }

  async uploadJsonToS3(generateInput) {
    console.log('uploadJsonToS3 finished')
  }

  async generateInput(orders, staffs) {
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
  }

  async getOrdersAndStaffs(input) {
    const { areaCode, appointmentDate } = input
    const [orders, staffs] = await Promise.all([
      this.getOrders({ areaCode }),
      this.getStaffs({ areaCode })
    ])

    return { orders, staffs }
  }

  async getOrders({ areaCode, appointmentDate }) {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    )
    return data
  }

  async getStaffs({ areaCode, appointmentDate }) {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    )
    return data
  }
}

export default preProcessOptimization
