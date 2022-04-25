const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "question"
    }]
})

tagSchema.set("toJSON", {
    transform: (doc, obj) => {
        delete obj.__v
    }
})

module.exports = mongoose.model("tag", tagSchema)
