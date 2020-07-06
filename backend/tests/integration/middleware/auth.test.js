const request = require('supertest');
const mongoDB = require('../../../startup/mongoDB');
const server = require('../../../startup/app');
const { Post } = require('../../../model/Post');
const { User } = require('../../../model/User');

describe("auth middleware", () => {

    beforeEach(() => {
        mongoDB.connect();
    });
    afterEach(async (done) => {
        await User.deleteMany({});
        await Post.deleteMany({});
        mongoDB.disconnect(done);
    });

    let token, post, user;

    const exec = async () => {
        return request(server)
            .post("/api/posts/")
            .set("x-auth-token", token)
            .send(post);
    }

    beforeEach(() => {
        user = new User({
            name: "username",
            email: "username@gmail.com",
            password: "password"
        });
        token = user.generateAuthToken();
        post = {
            post_title: "post_title",
            post_body: "post_body"
        }
    });

    it("should return 401 if no token provided", async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it("should return 400 if token is provided but not valid", async () => {
        token = "invalidtoken";
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it("should return 200 if token is valid", async () => {
        await user.save();
        const res = await exec();
        expect(res.status).toBe(200);
    })
})