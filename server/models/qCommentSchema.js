const mongoose = require("mongoose")

const qCommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        maxLength: 140,
        minLength: 1
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question"
    }
})

qCommentSchema.set("toJSON", {
    transform: (doc, obj) => {
        delete obj.__v
    }
})

module.exports = mongoose.model("qComment", qCommentSchema)
