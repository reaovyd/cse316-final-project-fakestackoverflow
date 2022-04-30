const mongoose = require("mongoose")

const aCommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "answer"
    },
    comment: {
        type: String,
        required: true,
        maxLength: 140,
        minLength: 1
    },
    date: {
        type: Date,
        default: () => new Date()
    }
})

aCommentSchema.set("toJSON", {
    transform: (doc, obj) => {
        delete obj.__v
    }
})

module.exports = mongoose.model("aComment", aCommentSchema)
