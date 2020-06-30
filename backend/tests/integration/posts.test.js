const request = require('supertest');

let server;

describe('route/posts', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach(() => { server.close(); });

    describe('GET /', () => {
        it('Should return at most 15 posts', async () => {
            const res = await request(server).get('api/posts');
            expect(res.status).toBe(200);
        })
    })
})