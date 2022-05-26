const request = require('supertest')
const mongoDB = require('../../startup/mongoDB')
const server = require('../../startup/app')
const { Post } = require('../../model/Post')
const { User } = require('../../model/User')
const { Comment } = require('../../model/Comment')
const bcrypt = require('bcryptjs')

describe('api/auth', () => {

  beforeAll(async () => {
    await mongoDB.connect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await Post.deleteMany({})
    await Comment.deleteMany({})
  })

  afterAll((done) => {
    mongoDB.disconnect(done)
  })

  describe('POST /', () => {
    let user, body

    const exec = async () => {
      return await request(server)
        .post('/api/auth')
        .send(body)
    }

    beforeEach(async () => {
      body = {
        email: 'username@gmail.com',
        password: 'password'
      }
      user = new User({
        name: 'username',
        email: 'username@gmail.com',
        password: 'password'
      })

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)

      await user.save()
    })

    it('should send status code 400 when invalid email is sent', async () => {
      body.email = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should send 400 error when password length is less then 6', async () => {
      body.password = 'less'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should send 400 error when password length is more than 1024', async () => {
      body.password = new Array(1026).join('a')
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 when user not found', async () => {
      body.email = 'noUserByThisEmail@gmail.com'
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 when password doesn\'t match', async () => {
      body.password = 'ValidPasswordButDoesntMatch'

      const res = await exec()
      expect(res.status).toBe(400)
    })
  })
})