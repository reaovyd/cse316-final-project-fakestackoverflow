const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question"
    },
    aComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "aComment"
    }],
    text: {
        type: String,
        required: true,
        minLength: 1
    },
    votes: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: () => new Date()
    }
})

answerSchema.set("toJSON", {
    transform: (doc, obj) => {
        delete obj.__v
    }
})

module.exports = mongoose.model("answer", answerSchema)
