const request = require('supertest')
const mongoDB = require('../../startup/mongoDB')
const server = require('../../startup/app')
const { Post } = require('../../model/Post')
const { User } = require('../../model/User')
const { Comment } = require('../../model/Comment')
const { mongoose } = require('../../startup/mongoDB')
const api = request(server)

describe('api/posts', () => {
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


  describe('GET /', () => {
    it('should return at most 15 posts', async () => {
      await Post.insertMany([
        { post_title: 'title 1', post_body: 'body 1' },
        { post_title: 'title 2', post_body: 'body 2' },
      ])

      const res = await api.get('/api/posts')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(post => post.post_title === 'title 1' && post.post_body === 'body 1'))
      expect(res.body.some(post => post.post_title === 'title 2' && post.post_body === 'body 2'))
      expect(res.body.length < 15).toBeTruthy()
    })
  })

  describe('GET /:postId', () => {
    it('should return post if valid postId', async () => {

      const userId = new mongoose.Types.ObjectId()

      const post = new Post({
        post_title: 'title1',
        post_body: 'body1',
        posted_by: userId,
        comments: []
      })
      await post.save()

      const res = await api.get('/api/posts/' + post._id)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('post_title', post.post_title)
      expect(res.body).toHaveProperty('post_body', post.post_body)
      expect(res.body).toHaveProperty('posted_by', post.posted_by.toString())
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })

    it('should return 404 if invalid postId is passed', async () => {
      const res = await api.get('/api/posts/1')

      expect(res.status).toBe(404)
    })

    it('should return 404 if no post with postId found', async () => {
      const validPostId = '5efb4ad85108c33d672daa9d'
      const res = await api.get('/api/posts/' + validPostId)

      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let token
    let post

    const exec = async () => {
      return await api
        .post('/api/posts')
        .set('x-auth-token', token)
        .send(post)
    }

    beforeEach(async () => {
      const user = new User({ name: 'name', email: 'email@gmail.com', password: 'hehehe' })
      await user.save()
      token = user.generateAuthToken()
      post = { post_title: 'title1', post_body: 'body1' }
    })

    it('should return 401 error when user is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 error when invalid post is sent', async () => {
      post = {}
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 404 error when user with id is not found', async () => {
      token = new User().generateAuthToken()
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should save post if it is valid', async () => {
      const res = await exec()

      post = await Post.findOne({ post_title: 'title1' })
      expect(res.status).toBe(201)
      expect(post).not.toBeNull()
    })
  })

  describe('POST /:postId/comments', () => {
    let postId
    let token
    let comment
    let post
    let user
    let firstComment
    let secondComment

    const exec = async () => {
      return await api
        .post('/api/posts/' + postId + '/comments')
        .set('x-auth-token', token)
        .send(comment)
    }

    beforeEach(async () => {
      const userId = new mongoose.Types.ObjectId()
      user = new User({
        _id: userId,
        name: 'username',
        email: 'username@gmail.com',
        password: 'hehehe'
      })

      const firstCommentId = new mongoose.Types.ObjectId()
      firstComment = new Comment({
        _id: firstCommentId,
        comment_body: 'this is comment 1',
        commented_by: userId
      })

      const secondCommentId = new mongoose.Types.ObjectId()
      secondComment = new Comment({
        _id: secondCommentId,
        comment_body: 'this is comment 2',
        commented_by: userId
      })

      const generatedPostId = new mongoose.Types.ObjectId()
      firstComment.commented_to = generatedPostId
      secondComment.commented_to = generatedPostId

      post = new Post({
        _id: generatedPostId,
        post_title: 'title1',
        post_body: 'body1',
        posted_by: userId,
        comments: [{
          _id: firstCommentId
        }, {
          _id: secondCommentId
        }]
      })
      await user.save()
      await post.save()
      await firstComment.save()
      await secondComment.save()

      postId = generatedPostId
      token = user.generateAuthToken()
      comment = {
        comment_body: 'this should be thrid comment'
      }
    })

    it('should return 401 error when user is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 when invalid comment is sent', async () => {
      comment = {}
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 404 when post with postId is not found', async () => {
      postId = ''
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should return 404 when valid postId is in params, but post not found', async () => {
      postId = new Post()._id
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should save comment if it is valid', async () => {
      const res = await exec()

      post = await Post.findOne({ _id: post._id })
      expect(res.status).toBe(201)
      expect(post.comments).not.toBeNull()
      expect(post.comments.length).toBe(3)
      expect(res.body).toHaveProperty('post_title', post.post_title)
      expect(res.body).toHaveProperty('post_body', post.post_body)
      expect(res.body).toHaveProperty('posted_by', user._id.toString())
    })
  })

  describe('Post /upvote', () => {
    let token
    let body
    let post
    let user

    const exec = async () => {
      return await api
        .post('/api/posts/upvote/')
        .set('x-auth-token', token)
        .send(body)
    }

    beforeEach(async () => {
      const userId = new mongoose.Types.ObjectId()
      user = new User({
        _id: userId,
        name: 'username',
        email: 'username@gmail.com',
        password: 'hehehe'
      })
      const postId = new mongoose.Types.ObjectId()
      user.voted_posts.push({ _id: postId, dir: 1 })
      await user.save()
      post = new Post({
        _id: postId,
        post_title: 'title1',
        post_body: 'body1',
        posted_by: user._id
      })
      await post.save()
      token = user.generateAuthToken()
      body = {
        postId,
        dir: 1
      }
    })

    it('should return 401 error when user is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 when invalid postId is sent', async () => {
      body.postId = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 when invalid dir is sent', async () => {
      body.dir = 2
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 401 when valid token is sent but user is not found', async () => {
      const newUser = new User({
        name: 'new',
        email: 'new@gmail.com',
        password: 'password'
      })
      token = newUser.generateAuthToken()

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 404 when post not found', async () => {
      body.postId = '5f001703a068ec32e6c03fa0'

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should have no effect if post is already upvoted and upvote direction is same 1', async () => {
      const dir = 1
      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      expect(res.status).toBe(200)
      expect(user.voted_posts.some(upvoted_post =>
        upvoted_post.dir === dir && upvoted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes).toBe(1)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })

    it('should have no effect if post is already upvoted and upvote direction is same -1', async () => {
      const dir = -1
      user.voted_posts.map(votedPost => votedPost._id === post._id ? votedPost.dir = dir : votedPost)

      await user.save()
      body.dir = -1

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })

      expect(res.status).toBe(200)
      expect(user.voted_posts.some(upvoted_post =>
        upvoted_post.dir === dir && upvoted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes).toBe(1)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })

    it('should have no effect if post is already upvoted and upvote direction is same 0', async () => {
      const dir = 0
      user.voted_posts.map(votedPost => votedPost._id === post._id ? votedPost.dir = dir : votedPost)

      await user.save()
      body.dir = 0

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      expect(res.status).toBe(200)
      expect(user.voted_posts.some(upvoted_post =>
        upvoted_post.dir === dir && upvoted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes).toBe(1)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)
    })

    it('should increase upvote count by 2 if previously downvoted(dir=-1) post is upvoted (dir=1) ', async () => {
      user.voted_posts.map(votedPost => votedPost._id === post._id ? votedPost.dir = -1 : votedPost)

      await user.save()

      body.dir = 1
      const previousUpvoteCount = post.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })

      expect(res.status).toBe(200)
      expect(user.voted_posts.some(upvoted_post =>
        upvoted_post.dir === body.dir && upvoted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes - previousUpvoteCount).toBe(2)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)
    })

    it('should increase upvote count by 1 if previously upvoted_post with dir=0 is upvoted(dir=1)', async () => {
      user.voted_posts.map(votedPost => votedPost._id === post._id ? votedPost.dir = -0 : votedPost)

      await user.save()
      body.dir = 1
      const previousUpvoteCount = post.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })

      expect(res.status).toBe(200)
      expect(user.voted_posts.some(upvoted_post =>
        upvoted_post.dir === body.dir && upvoted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes - previousUpvoteCount).toBe(1)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })

    it('should decrease upvote count by 1 if previously upvoted_post with dir=0 is downvoted(dir=-1)', async () => {
      user.voted_posts.map(votedPost => votedPost._id === post._id ? votedPost.dir = 0 : votedPost)
      await user.save()
      body.dir = -1
      const previousUpvoteCount = post.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })

      expect(res.status).toBe(200)
      expect(user.voted_posts.some(upvoted_post =>
        upvoted_post.dir === body.dir && upvoted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes - previousUpvoteCount).toBe(-1)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })

    it('should decrease upvote count by 2 if previously upvoted_post with dir=1 is downvoted(dir=-1)', async () => {
      body.dir = -1
      const previousUpvoteCount = post.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })

      expect(res.status).toBe(200)
      expect(user.voted_posts.some(upvoted_post =>
        upvoted_post.dir === body.dir && upvoted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes - previousUpvoteCount).toBe(-2)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })

    it('should decrease upvote count by 1 if preiously upvoted_post with dir=1 is canceled(dir=0)', async () => {
      body.dir = 0
      const previousUpvoteCount = post.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })

      expect(res.status).toBe(200)
      expect(user.voted_posts.some(voted_post =>
        voted_post.dir === body.dir && voted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes - previousUpvoteCount).toBe(-1)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })

    it('should increase upvote count by 1 if preiously downvoted post with dir=-1 is canceled(dir=0)', async () => {
      user.voted_posts.map(votedPost => votedPost._id === post._id ? votedPost.dir = -1 : votedPost)
      await user.save()
      body.dir = 0
      const previousUpvoteCount = post.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })

      expect(res.status).toBe(200)
      expect(user.voted_posts.some(voted_post =>
        voted_post.dir === body.dir && voted_post._id.toString() === post._id.toString())).toBeTruthy()
      expect(post.upvotes - previousUpvoteCount).toBe(1)
      expect(res.body).toHaveProperty('upvotes', post.upvotes)

    })
  })

  describe('Post /upvote/comment', () => {
    let token, body, post, user, firstComment, userIdThatCommented

    const exec = async () => {
      return await api
        .post('/api/posts/upvote/comment')
        .set('x-auth-token', token)
        .send(body)
    }

    beforeEach(async () => {

      const userId = new mongoose.Types.ObjectId()
      user = new User({
        _id: userId,
        name: 'username',
        email: 'username@gmail.com',
        password: 'hehehe'
      })

      const firstCommentId = new mongoose.Types.ObjectId()
      // here we simulate comment is commented by someone else. So that upvote mechanisms can be tested properly.
      userIdThatCommented = new mongoose.Types.ObjectId()
      firstComment = new Comment({
        _id: firstCommentId,
        comment_body: 'this is comment 1',
        commented_by: userIdThatCommented
      })

      const generatedPostId = new mongoose.Types.ObjectId()
      firstComment.commented_to = generatedPostId

      post = new Post({
        _id: generatedPostId,
        post_title: 'title1',
        post_body: 'body1',
        posted_by: userId,
        comments: [{
          _id: firstCommentId
        }]
      })
      await user.save()
      await post.save()
      await firstComment.save()

      token = user.generateAuthToken()

      body = {
        commentId: firstCommentId,
        dir: 1
      }
    })

    it('should return 401 error when user is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })
    it('should return 400 when invalid postId is sent', async () => {
      body.postId = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 when invalid dir is sent', async () => {
      body.dir = 2
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 401 when user not found', async () => {
      const newUser = new User({
        name: 'new',
        email: 'new@gmail.com',
        password: 'password'
      })
      token = newUser.generateAuthToken()

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 404 when comment not found', async () => {
      body.commentId = '628cf9e8973cfcd40a91eca0'

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should push new entry on user.voted_comments.. should increase comment upvote count', async () => {

      const res = await exec()

      user = await User.findOne({ email: 'username@gmail.com' })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)

      expect(res.status).toBe(200)
      expect(user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0].dir === 1).toBeTruthy()
      expect(firstComment.upvotes).toBe(2)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })

    it('should have no effect if commment is already upvoted and upvote direction is same 1', async () => {
      user.voted_comments.push({
        _id: firstComment._id,
        dir: 1
      })
      await user.save()

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)

      expect(res.status).toBe(200)
      expect(user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0].dir === 1).toBeTruthy()
      expect(firstComment.upvotes).toBe(1)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })

    it('should have no effect if comment is already upvoted and upvote direction is same -1', async () => {
      body.dir = -1
      user.voted_comments.push({
        _id: firstComment._id,
        dir: -1
      })
      await user.save()

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findOne({ _id: firstComment._id })
      console.log(firstComment._id)

      expect(res.status).toBe(200)
      expect(firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && user.voted_comments[0].dir === -1).toBeTruthy()
      expect(firstComment.upvotes).toBe(1)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })


    it('should increase upvote count by 2 if previously downvoted(dir=-1) comment is upvoted (dir=1) ', async () => {
      body.dir = 1
      user.voted_comments.push({
        _id: firstComment._id,
        dir: -1
      })
      await user.save()
      const previousUpvoteCount = firstComment.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)
      expect(firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && user.voted_comments[0].dir === 1).toBeTruthy()
      expect(firstComment.upvotes - previousUpvoteCount).toBe(2)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })

    it('should increase upvote count by 1 if previously upvoted comment with dir=0 is upvoted(dir=1)', async () => {
      body.dir = 1
      user.voted_comments.push({
        _id: firstComment._id,
        dir: 0
      })
      await user.save()
      const previousUpvoteCount = firstComment.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)
      expect(firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && user.voted_comments[0].dir === 1).toBeTruthy()
      expect(firstComment.upvotes - previousUpvoteCount).toBe(1)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })

    it('should decrease upvote count by 1 if previously neutral comment with dir=0 is downvoted(dir=-1)', async () => {
      body.dir = -1
      user.voted_comments.push({
        _id: firstComment._id,
        dir: 0
      })
      await user.save()
      const previousUpvoteCount = firstComment.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)

      expect(firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && user.voted_comments[0].dir === -1).toBeTruthy()
      expect(firstComment.upvotes - previousUpvoteCount).toBe(-1)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })

    it('should decrease upvote count by 2 if previously upvoted comment with dir=1 is downvoted(dir=-1)', async () => {
      body.dir = -1
      user.voted_comments.push({
        _id: firstComment._id,
        dir: 1
      })
      await user.save()
      const previousUpvoteCount = firstComment.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)

      expect(firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && user.voted_comments[0].dir === -1).toBeTruthy()
      expect(firstComment.upvotes - previousUpvoteCount).toBe(-2)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })

    it('should decrease upvote count by 1 if preiously upvoted_post with dir=1 is canceled(dir=0)', async () => {
      body.dir = 0
      user.voted_comments.push({
        _id: firstComment._id,
        dir: 1
      })
      await user.save()
      const previousUpvoteCount = firstComment.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)

      expect(firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && user.voted_comments[0].dir === 0).toBeTruthy()
      expect(firstComment.upvotes - previousUpvoteCount).toBe(-1)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })

    it('should increase upvote count by 1 if preiously downvoted post with dir=-1 is canceled(dir=0)', async () => {
      body.dir = 0
      user.voted_comments.push({
        _id: firstComment._id,
        dir: -1
      })
      await user.save()
      const previousUpvoteCount = firstComment.upvotes

      const res = await exec()

      user = await User.findOne({ _id: user._id })
      post = await Post.findOne({ _id: post._id })
      firstComment = await Comment.findById(firstComment._id)

      expect(firstComment.commented_to.toString() === post._id.toString()
        && user.voted_comments[0]._id.toString() === firstComment._id.toString()
        && user.voted_comments[0].dir === 0).toBeTruthy()
      expect(firstComment.upvotes - previousUpvoteCount).toBe(1)
      expect(res.body).toHaveProperty('upvotes', firstComment.upvotes)

    })
  })
})