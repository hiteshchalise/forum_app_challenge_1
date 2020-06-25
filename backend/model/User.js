const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    upvoted_posts: [{
        postId: String,
        upvote_dir: Number
    }],
    upvoted_comments: [{
        postId: String,
        comments: [{
            commentId: String,
            upvote_dir: Number
        }]
    }]
});

UserSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        { id: this._id },
        config.get("REFRESH_TOKEN")
    );
    return refreshToken;
}

UserSchema.methods.generateAuthToken = function () {
    const authToken = jwt.sign(
        { id: this._id },
        config.get("ACCESS_TOKEN_SECRET"),
        { expiresIn: 3600 });
    return authToken;
}

//TODO: name of model from user to User maybe?
const User = mongoose.model('user', UserSchema);
module.exports = User;