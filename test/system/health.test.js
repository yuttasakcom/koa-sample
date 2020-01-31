import request from 'supertest'
import server from '../../src'

afterEach(() => {
  server.close()
})

describe('routes: index', () => {
  test('should respond as expected', async () => {
    const response = await request(server).get('/system/health')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/plain')
    expect(response.text).toEqual('OK')
  })
})
