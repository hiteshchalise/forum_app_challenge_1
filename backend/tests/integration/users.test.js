const request = require('supertest')
const mongoDB = require('../../startup/mongoDB')
const server = require('../../startup/app')
const { User } = require('../../model/User')
const api = request(server)


describe('api/users', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    // await Post.deleteMany({});
    // await Comment.deleteMany({});
  }, 100000)

  describe('POST /', () => {
    let user

    const exec = async () => {
      return api
        .post('/api/users')
        .send(user)
    }

    beforeEach(() => {
      user = {
        name: 'username',
        email: 'username@gmail.com',
        password: 'password'
      }
    })

    it('should send 400 error when username is more than 255 character long', async () => {
      user.name = new Array(257).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should send 400 error when email is invalid', async () => {
      user.email = 'invalidemail'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should send 400 error when password length is less then 6', async () => {
      user.password = 'less'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should send 400 error when password length is more than 1024', async () => {
      user.password = new Array(1026).join('a')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should send 400 error when email is not unique', async () => {
      const newUser = new User({
        name: 'username',
        email: 'username@gmail.com',
        password: 'password'
      })
      await newUser.save()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should send 400 error when username is not unique', async () => {
      const newUser = new User({
        name: 'username',
        email: 'uniqueEmail@gmail.com',
        password: 'password'
      })
      await newUser.save()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should save user when proper input is provided', async () => {
      const res = await exec()

      const savedUser = await User.findOne({ email: user.email })
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('authToken', savedUser.generateAuthToken())
      expect(res.body.user).toHaveProperty('name', savedUser.name)
      expect(res.body.user).toHaveProperty('email', savedUser.email)
    })
  })

  describe('GET /:name', () => {
    it('should return 404 when user with name not found', async () => {
      const res = await request(server).get('/api/users/' + 'username')
      expect(res.status).toBe(404)
    })

    it('should return 200 with user when found', async () => {
      const user = new User({
        name: 'username',
        email: 'username@gmail.com',
        password: 'password'
      })
      await user.save()

      const res = await request(server).get('/api/users/' + user.name)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', user.name)
      expect(res.body).toHaveProperty('email', user.email)
    })
  })

})


afterAll(async () => {
  mongoDB.disconnect()
})