const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    reputation: {
        type: Number,
        default: 105
    },
    creationDate: {
        type: Date,
        default: () => new Date()
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question'
    }],
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "answer"
    }], 
    qComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "qComment"
    }],
    aComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "aComment"
    }]
})

userSchema.set("toJSON", {
    transform: (doc, obj) => {
        delete obj.email
        delete obj.passwordHash
        delete obj.__v
    }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("user", userSchema)
