const request = require('supertest');
const mongoDB = require('../../startup/mongoDB');
const server = require('../../startup/app');
const { Post } = require('../../model/Post');
const { User } = require('../../model/User');

describe('api/posts', () => {
    beforeEach(() => {
        mongoDB.connect();
    });
    afterEach(async (done) => {
        await User.deleteMany({});
        await Post.deleteMany({});
        mongoDB.disconnect(done);
    })


    describe("GET /", () => {
        it("should return at most 15 posts", async () => {
            const posts = await Post.insertMany([
                { post_title: "title 1", post_body: "body 1" },
                { post_title: "title 2", post_body: "body 2" },
            ]);

            const res = await request(server).get("/api/posts");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(post => post.post_title === "title 1" && post.post_body === "body 1"));
            expect(res.body.some(post => post.post_title === "title 2" && post.post_body === "body 2"));
            expect(res.body.length < 15).toBeTruthy();
        });
    });

    describe("GET /:postId", () => {
        it("should return post if valid postId", async () => {
            const post = new Post({
                post_title: "title1",
                post_body: "body1",
                posted_by: "username"
            });
            await post.save();

            const res = await request(server).get("/api/posts/" + post._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("post_title", post.post_title);
            expect(res.body).toHaveProperty("post_body", post.post_body);
            expect(res.body).toHaveProperty("posted_by", post.posted_by);
            expect(res.body).toHaveProperty("upvotes", post.upvotes);

        });

        it("should return 404 if invalid postId is passed", async () => {
            const res = await request(server).get("/api/posts/1");

            expect(res.status).toBe(404);
        });

        it("should return 404 if no post with postId found", async () => {
            const validPostId = "5efb4ad85108c33d672daa9d";
            const res = await request(server).get("/api/posts/" + validPostId);

            expect(res.status).toBe(404);
        })
    });

    describe("POST /", () => {
        let token;
        let post;

        const exec = async () => {
            return await request(server)
                .post("/api/posts")
                .set("x-auth-token", token)
                .send(post);
        };

        beforeEach(async () => {
            const user = new User({ name: "name", email: "email@gmail.com", password: "hehehe" });
            await user.save();
            token = user.generateAuthToken();
            post = { post_title: "title1", post_body: "body1" };
        })

        it("should return 401 error when user is not logged in", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should return 400 error when invalid post is sent", async () => {
            post = {}
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 404 error when user with id is not found", async () => {
            token = new User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should save post if it is valid", async () => {
            const res = await exec();

            post = await Post.findOne({ post_title: "title1" });
            expect(res.status).toBe(200);
            expect(post).not.toBeNull();
        });
    });

    describe("POST /:postId/comments", () => {
        let postId;
        let token;
        let comment;
        let post;
        let user;

        const exec = async () => {
            return await request(server)
                .post("/api/posts/" + postId + "/comments")
                .set("x-auth-token", token)
                .send(comment)
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
            postId = post._id;
            comment = {
                comment_body: "comment body"
            }
        });

        it("should return 401 error when user is not logged in", async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should return 400 when invalid comment is sent", async () => {
            comment = {};
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 404 when post with postId is not found", async () => {
            postId = "";
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should return 404 when valid postId is in params, but post not found", async () => {
            postId = new Post()._id;
            const res = await exec();
            expect(res.status).toBe(404);
        })

        it("should save comment if it is valid", async () => {
            const res = await exec();

            post = await Post.findOne({ _id: post._id }).exec();
            expect(res.status).toBe(200);
            expect(post.comments).not.toBeNull();
            expect(post.comments.length === 1).toBeTruthy();
            expect(res.body).toHaveProperty("post_title", post.post_title);
            expect(res.body).toHaveProperty("post_body", post.post_body);
            expect(res.body).toHaveProperty("posted_by", user.name);
        });
    });
});