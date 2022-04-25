const mongoose = require("mongoose") 

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50,
        minLength: 1
    },
    summary: {
        type: String,
        required: true,
        maxLength: 140,
        minLength: 1
    },
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
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    qComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "qComment"
    }],
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "answer"
    }],
    views: {
        type: Number,
        default: 0
    }
})

questionSchema.set("toJSON", {
    transform: (doc, obj) => {
        delete obj.__v
    }
})

module.exports = mongoose.model("question", questionSchema)
