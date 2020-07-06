const { validateUser } = require("../../model/User");

describe("Testing validation fuction from User model", () => {
    let name, email, password;
    const exec = () => {
        return validateUser({
            name, email, password
        });
    }
    beforeEach(() => {
        name = "ValidName";
        email = "validEmail@gmail.com";
        password = "validPassword"
    })

    it("should return error when name is empty", () => {
        name = "";
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should return error when name is more than 255 char length", () => {
        name = new Array(257).join('a');
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should return error when email is empty", () => {
        email = "";
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should return error when email is more than 255 char length", () => {
        email = new Array(257).join('a');
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should return error when email is less than 255 char length, but is invalid", () => {
        email = new Array(255).join('a');
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should return error when password is empty", () => {
        password = "";
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should return error when password is more than 1026 char length", () => {
        password = new Array(1026).join('a');
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should return error when password is less than 6 char length", () => {
        password = "less"
        const { error } = exec();
        expect(error).not.toBeUndefined();
    });

    it("should not return error when valid user is passed", () => {
        const { error } = exec();
        expect(error).toBeUndefined();
    });


})