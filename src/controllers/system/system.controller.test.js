import request from 'supertest'
import server from '../../index'

afterEach(() => {
  server.close()
})

describe('/system/health', () => {
  test('expected health check is OK', async () => {
    const response = await request(server).get('/system/health')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/plain')
    expect(response.text).toEqual('OK')
  })
})
