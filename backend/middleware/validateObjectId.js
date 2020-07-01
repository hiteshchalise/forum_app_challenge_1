const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.postId))
        return res.status(404).json({ msg: "Invalid postId" });

    next();
}