const request = require('supertest');
const mongoDB = require('../../startup/mongoDB');
const server = require('../../startup/app');
const { Post } = require('../../model/Post');
const { User } = require('../../model/User');

describe('api/users', () => {
    beforeEach(async () => {
        mongoDB.connect();
    });
    afterEach(async (done) => {
        await User.deleteMany({});
        await Post.deleteMany({});
        mongoDB.disconnect(done);
    });

    describe("POST /", () => {
        let user;

        const exec = async () => {
            return await request(server)
                .post("/api/users")
                .send(user);
        }

        beforeEach(() => {
            user = {
                name: "username",
                email: "username@gmail.com",
                password: "password"
            }
        });

        it("should send 400 error when username is more than 255 character long", async () => {
            user.name = new Array(257).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should send 400 error when email is invalid", async () => {
            user.email = "invalidemail";

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should send 400 error when password length is less then 6", async () => {
            user.password = "less";

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should send 400 error when password length is more than 1024", async () => {
            user.password = new Array(1026).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should send 400 error when email is not unique", async () => {
            const newUser = new User({
                name: "username",
                email: "username@gmail.com",
                password: "password"
            });
            await newUser.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should send 400 error when username is not unique", async () => {
            const newUser = new User({
                name: "username",
                email: "uniqueEmail@gmail.com",
                password: "password"
            });
            await newUser.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should save user when proper input is provided", async () => {
            const res = await exec();

            const savedUser = await User.findOne({ email: user.email });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("authToken", savedUser.generateAuthToken());
            expect(res.body.user).toHaveProperty("name", savedUser.name);
            expect(res.body.user).toHaveProperty("email", savedUser.email);
        });
    });

    describe("GET /:name", () => {
        it("should return 404 when user with name not found", async () => {
            const res = await request(server).get("/api/users/" + "username");
            expect(res.status).toBe(404);
        });

        it("should return 200 with user when found", async () => {
            const user = new User({
                name: "username",
                email: "username@gmail.com",
                password: "password"
            });
            await user.save();

            const res = await request(server).get("/api/users/" + user.name);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", user.name);
            expect(res.body).toHaveProperty("email", user.email);
        })
    });

    describe("Post /upvote", () => {
        let token;
        let body;
        let post;
        let user;

        const exec = async () => {
            return await request(server)
                .post("/api/users/upvote/")
                .set("x-auth-token", token)
                .send(body)
        }

        beforeEach(async () => {
            post = new Post({
                post_title: "title1",
                post_body: "body1",
                posted_by: "username"
            });
            user = new User({
                name: "username",
                email: "username@gmail.com",
                password: "hehehe"
            });
            await user.save();
            await post.save();
            token = user.generateAuthToken();
            body = {
                postId: post._id,
                dir: 1
            }
        });

        it("should return 401 error when user is not logged in", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should return 400 when invalid postId is sent", async () => {
            body.postId = "";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 400 when invalid dir is sent", async () => {
            body.dir = 2;
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 401 when valid token is sent but user is not found", async () => {
            const newUser = new User({
                name: "new",
                email: "new@gmail.com",
                password: "password"
            });
            token = newUser.generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return 404 when post not found", async () => {
            body.postId = "5f001703a068ec32e6c03fa0";

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it("should push new entry on user.upvoted_posts with upvote_dir 1 & postId.. should increase post upvote count", async () => {

            const res = await exec();

            user = await User.findOne({ email: "username@gmail.com" });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.postId === post._id.toString()
                && upvoted_post.upvote_dir === 1)).toBeTruthy();
            expect(post.upvotes).toBe(1);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);
        });

        it("should have no effect if post is already upvoted and upvote direction is same 1", async () => {
            const upvote_dir = 1;
            user.upvoted_posts.push({ postId: post._id, upvote_dir });
            await user.save();

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === upvote_dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes).toBe(0);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });

        it("should have no effect if post is already upvoted and upvote direction is same -1", async () => {
            const upvote_dir = -1;
            user.upvoted_posts.push({ postId: post._id, upvote_dir });
            await user.save();
            body.dir = -1;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === upvote_dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes).toBe(0);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });

        it("should have no effect if post is already upvoted and upvote direction is same 0", async () => {
            const upvote_dir = 0;
            user.upvoted_posts.push({ postId: post._id, upvote_dir });
            await user.save();
            body.dir = 0;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === upvote_dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes).toBe(0);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);
        });

        it("should increase upvote count by 2 if previously downvoted(dir=-1) post is upvoted (dir=1) ", async () => {

            const upvote_dir = -1;
            user.upvoted_posts.push({ postId: post._id, upvote_dir });
            await user.save();
            body.dir = 1;
            const previousUpvoteCount = post.upvotes;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === body.dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes - previousUpvoteCount).toBe(2);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);
        });

        it("should increase upvote count by 1 if previously upvoted_post with dir=0 is upvoted(dir=1)", async () => {
            const upvote_dir = 0;
            user.upvoted_posts.push({ postId: post._id, upvote_dir });
            await user.save();
            body.dir = 1;
            const previousUpvoteCount = post.upvotes;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });

            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === body.dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes - previousUpvoteCount).toBe(1);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });

        it("should decrease upvote count by 1 if previously upvoted_post with dir=0 is downvoted(dir=-1)", async () => {
            user.upvoted_posts.push({ postId: post._id, upvote_dir: 0 });
            await user.save();
            body.dir = -1;
            const previousUpvoteCount = post.upvotes;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });

            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === body.dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes - previousUpvoteCount).toBe(-1);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });

        it("should decrease upvote count by 2 if previously upvoted_post with dir=1 is downvoted(dir=-1)", async () => {
            user.upvoted_posts.push({ postId: post._id, upvote_dir: 1 });
            await user.save();
            body.dir = -1;
            const previousUpvoteCount = post.upvotes;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });

            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === body.dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes - previousUpvoteCount).toBe(-2);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });

        it("should decrease upvote count by 1 if preiously upvoted_post with dir=1 is canceled(dir=0)", async () => {
            user.upvoted_posts.push({ postId: post._id, upvote_dir: 1 });
            await user.save();
            body.dir = 0;
            const previousUpvoteCount = post.upvotes;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });

            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === body.dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes - previousUpvoteCount).toBe(-1);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });

        it("should increase upvote count by 1 if preiously downvoted post with dir=-1 is canceled(dir=0)", async () => {
            user.upvoted_posts.push({ postId: post._id, upvote_dir: -1 });
            await user.save();
            body.dir = 0;
            const previousUpvoteCount = post.upvotes;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });

            expect(res.status).toBe(200);
            expect(user.upvoted_posts.some(upvoted_post =>
                upvoted_post.upvote_dir === body.dir && upvoted_post.postId === post._id.toString())).toBeTruthy();
            expect(post.upvotes - previousUpvoteCount).toBe(1);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });
    });

    describe("Post /upvote/comment", () => {
        let token, body, post, user, comment;

        const exec = async () => {
            return await request(server)
                .post("/api/users/upvote/comment")
                .set("x-auth-token", token)
                .send(body)
        }

        beforeEach(async () => {
            comment = {
                comment_body: "comment",
                commented_by: "username"
            };
            post = new Post({
                post_title: "title1",
                post_body: "body1",
                posted_by: "username"
            });
            post.comments.push(comment);
            user = new User({
                name: "username",
                email: "username@gmail.com",
                password: "hehehe"
            });

            await user.save();
            await post.save();
            token = user.generateAuthToken();
            body = {
                postId: post._id,
                commentId: post.comments[0]._id,
                dir: 1
            }
        });

        it("should return 401 error when user is not logged in", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it("should return 400 when invalid postId is sent", async () => {
            body.postId = "";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 400 when invalid dir is sent", async () => {
            body.dir = 2;
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 401 when user not found", async () => {
            const newUser = new User({
                name: "new",
                email: "new@gmail.com",
                password: "password"
            });
            token = newUser.generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return 404 when post not found", async () => {
            body.postId = "5f001703a068ec32e6c03fa0";

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it("should push new entry on user.upvoted_comments.. should increase comment upvote count", async () => {

            const res = await exec();

            user = await User.findOne({ email: "username@gmail.com" });
            post = await Post.findOne({ _id: post._id });

            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === 1).toBeTruthy();
            expect(post.comments[0].upvotes).toBe(1);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should push new entry on user.upvoted_comments.comments if user.upvoted_comments on a post already exists.. should increase comment upvote count", async () => {

            // upvoted_comments are stored based on postId, multiple comments on same post are stored within same postId, this test covers condition where user.upvoted_comments already has entry of postId but not for this particular comment.

            user.upvoted_comments.push({
                postId: post._id, comments: []
            });
            await user.save();

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === 1).toBeTruthy();
            expect(post.comments[0].upvotes).toBe(1);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should have no effect if commment is already upvoted and upvote direction is same 1", async () => {
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: 1
                }]
            });
            await user.save();

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === 1).toBeTruthy();
            expect(post.comments[0].upvotes).toBe(0);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should have no effect if comment is already upvoted and upvote direction is same -1", async () => {
            body.dir = -1;
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: -1
                }]
            });
            await user.save();

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === -1).toBeTruthy();
            expect(post.comments[0].upvotes).toBe(0);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });


        it("should increase upvote count by 2 if previously downvoted(dir=-1) comment is upvoted (dir=1) ", async () => {
            body.dir = 1;
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: -1
                }]
            });
            await user.save();
            const previousUpvoteCount = post.comments[0].upvotes;

            const res = await exec();

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === 1).toBeTruthy();
            expect(post.comments[0].upvotes - previousUpvoteCount).toBe(2);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should increase upvote count by 1 if previously upvoted comment with dir=0 is upvoted(dir=1)", async () => {
            body.dir = 1;
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: 0
                }]
            });
            await user.save();

            const res = await exec();
            const previousUpvoteCount = post.comments[0].upvotes;

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === 1).toBeTruthy();
            expect(post.comments[0].upvotes - previousUpvoteCount).toBe(1);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should decrease upvote count by 1 if previously neutral comment with dir=0 is downvoted(dir=-1)", async () => {
            body.dir = -1;
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: 0
                }]
            });
            await user.save();

            const res = await exec();
            const previousUpvoteCount = post.comments[0].upvotes;

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === -1).toBeTruthy();
            expect(post.comments[0].upvotes - previousUpvoteCount).toBe(-1);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should decrease upvote count by 2 if previously upvoted comment with dir=1 is downvoted(dir=-1)", async () => {
            body.dir = -1;
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: 1
                }]
            });
            await user.save();

            const res = await exec();
            const previousUpvoteCount = post.comments[0].upvotes;

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === -1).toBeTruthy();
            expect(post.comments[0].upvotes - previousUpvoteCount).toBe(-2);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should decrease upvote count by 1 if preiously upvoted_post with dir=1 is canceled(dir=0)", async () => {
            body.dir = 0;
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: 1
                }]
            });
            await user.save();

            const res = await exec();
            const previousUpvoteCount = post.comments[0].upvotes;

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === 0).toBeTruthy();
            expect(post.comments[0].upvotes - previousUpvoteCount).toBe(-1);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });

        it("should increase upvote count by 1 if preiously downvoted post with dir=-1 is canceled(dir=0)", async () => {
            body.dir = 0;
            user.upvoted_comments.push({
                postId: post._id, comments: [{
                    commentId: post.comments[0]._id,
                    upvote_dir: -1
                }]
            });
            await user.save();

            const res = await exec();
            const previousUpvoteCount = post.comments[0].upvotes;

            user = await User.findOne({ _id: user._id });
            post = await Post.findOne({ _id: post._id });
            expect(res.status).toBe(200);
            expect(user.upvoted_comments[0].postId === post._id.toString()
                && user.upvoted_comments[0].comments[0].commentId === post.comments[0]._id.toString()
                && user.upvoted_comments[0].comments[0].upvote_dir === 0).toBeTruthy();
            expect(post.comments[0].upvotes - previousUpvoteCount).toBe(1);
            expect(res.body).toHaveProperty("upvotes", post.comments[0].upvotes);

        });
    });
});