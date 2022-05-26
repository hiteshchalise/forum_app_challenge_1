const request = require('supertest')
const mongoDB = require('../../../startup/mongoDB')
const server = require('../../../startup/app')
const { Post } = require('../../../model/Post')

describe('validateObjectId middleware', () => {
  beforeEach(() => {
    mongoDB.connect()
  })

  afterEach(async (done) => {
    await Post.deleteMany({})
    mongoDB.disconnect(done)
  })

  it('should return 404 error when invalid postId is sent', async () => {
    const res = await request(server).get('/api/posts/invalidPostId')
    expect(res.status).toBe(404)
  })

  it('should return 200 when valid postId is sent', async () => {
    const post = new Post({ post_title: 'title', post_body: 'body' })
    await post.save()
    const res = await request(server).get('/api/posts/' + post._id)

    expect(res.status).toBe(200)
  })
})