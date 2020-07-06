const request = require('supertest');
const mongoDB = require('../../startup/mongoDB');
const server = require('../../startup/app');
const { Post } = require('../../model/Post');
const { User } = require('../../model/User');
const bcrypt = require('bcryptjs');

describe('api/auth', () => {
    beforeEach(() => {
        mongoDB.connect();
    });
    afterEach(async (done) => {
        await User.deleteMany({});
        await Post.deleteMany({});
        mongoDB.disconnect(done);
    });

    describe("POST /", () => {
        let user, body;

        const exec = async () => {
            return await request(server)
                .post("/api/auth")
                .send(body);
        }

        beforeEach(async () => {
            body = {
                email: "username@gmail.com",
                password: "password"
            }
            user = new User({
                name: "username",
                email: "username@gmail.com",
                password: "password"
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            await user.save();
        });

        it("should send status code 400 when invalid email is sent", async () => {
            body.email = "";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should send 400 error when password length is less then 6", async () => {
            body.password = "less";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should send 400 error when password length is more than 1024", async () => {
            body.password = new Array(1026).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should return 400 when user not found", async () => {
            body.email = "noUserByThisEmail@gmail.com";
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return 400 when password doesn't match", async () => {
            body.password = "ValidPasswordButDoesntMatch";

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it("should authenticate user and send access token in respose json and refresh token in cookie", async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.headers['set-cookie'].length).toBe(1);
            expect(res.headers['set-cookie'][0]).toBe(`refreshToken=${user.generateRefreshToken()}; Path=/; HttpOnly; SameSite=Strict`);

            expect(res.body).toEqual({
                authToken: user.generateAuthToken(),
                user: {
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    upvoted_posts: user.upvoted_posts.toObject(),
                    upvoted_comments: user.upvoted_comments.toObject()
                }
            });
        });
    });

    describe("GET /refresh", () => {
        let refreshToken, user;

        const exec = async () => {
            return await request(server)
                .get("/api/auth/refresh")
                .set("Cookie", [`refreshToken=${refreshToken}`]);
        }

        beforeEach(async () => {
            user = new User({
                name: "username",
                email: "username@gmail.com",
                password: "password"
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            await user.save();
            refreshToken = user.generateRefreshToken();
        });

        it("should send 401 status code when no refreshToken is sent", async () => {
            refreshToken = "";
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it("should send 500 status code when invalid refreshToken is sent", async () => {
            refreshToken = "invalid refresh token";
            const res = await exec();
            expect(res.status).toBe(500);
        })

        it("should send 404 status code when no user is found", async () => {
            const newUser = await new User({ name: "newUser", email: "newUser@gmail.com", password: "newPassword" });
            refreshToken = newUser.generateRefreshToken();

            const res = await exec();
            expect(res.status).toBe(404);
        });

        it("should authenticate user and send access token in respose json", async () => {
            const res = await exec();

            expect(res.status).toBe(200);

            expect(res.body).toEqual({
                authToken: user.generateAuthToken(),
                user: {
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    upvoted_posts: user.upvoted_posts.toObject(),
                    upvoted_comments: user.upvoted_comments.toObject()
                }
            });
        });
    });

    describe("POST /logout", () => {
        it("should set invalid refresh cookie", async () => {
            const res = await request(server).post("/api/auth/logout/");

            expect(res.status).toBe(200);
            expect(res.headers['set-cookie'].length).toBe(1);
            expect(res.headers['set-cookie'][0]).toBe(`refreshToken=InvalidCookie; Path=/; HttpOnly; SameSite=Strict`);

            expect(res.body).toHaveProperty("msg", "cookie destroyed");
        });
    });
});