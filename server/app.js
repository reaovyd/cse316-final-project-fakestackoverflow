const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
require("express-async-errors")
const logger = require("./utils/logger")
const config = require("./utils/config")
const userRoute = require("./controllers/userRoute")
const questionRoute = require("./controllers/questionRoute")
const qCommentRoute = require("./controllers/qCommentRoute")
const aCommentRoute = require("./controllers/aCommentRoute")
const answerRoute = require("./controllers/answerRoute")
const tagRoute = require("./controllers/tagRoute")
const errorMiddleware = require("./utils/errorMiddleware")

logger.info("Connecting to MongoDB")
mongoose.connect(config.MONGODB_URI).then(res => {
    logger.info("Connected to MongoDB!")
}).catch(err => {
    logger.error("Failed to connect!", err.message)
})

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.use("/users", userRoute)
app.use("/questions", questionRoute)
app.use("/tags", tagRoute)
app.use("/qComments", qCommentRoute)
app.use("/aComments", aCommentRoute)
app.use("/answers", answerRoute)

app.use(errorMiddleware.unknownEndpoint)
app.use(errorMiddleware.runtimeError)

module.exports = app
