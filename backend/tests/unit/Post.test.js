const { validatePost, validateComment } = require("../../model/Post");

describe("Testing validation fuctions from Post model", () => {
    describe("validatePost", () => {
        it("should return error when post_title is empty", () => {
            const { error } = validatePost({ post_body: "not empty" });
            expect(error).not.toBeUndefined();
        });
        it("should return error when post_body is empty", () => {
            const { error } = validatePost({ post_title: "not empty" });
            expect(error).not.toBeUndefined();
        });
        it("should return error when post is empty", () => {
            const { error } = validatePost({});
            expect(error).not.toBeUndefined();
        });
        it("should not return error when post is valid", () => {
            const { error } = validatePost({ post_title: "title", post_body: "body" });
            expect(error).toBeUndefined();
        });
    });
    describe("validateComment", () => {
        it("should return error when comment_body is empty", () => {
            const { error } = validatePost({ post_title: "not empty" });
            expect(error).not.toBeUndefined();
        });
        it("should not return error when post is valid", () => {
            const { error } = validatePost({ post_title: "title", post_body: "body" });
            expect(error).toBeUndefined();
        });
    });
})