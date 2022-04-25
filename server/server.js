// Application server
const http = require("http")
const app = require("./app")
const logger = require("./utils/logger")
const config = require("./utils/config")
const mongoose = require("mongoose")

const server = http.createServer(app)
server.listen(config.SERVER_PORT, () => {
    logger.info(`Connected to server on port ${config.SERVER_PORT}!`)
})

process.on("SIGINT", () => {
    logger.info("Disconnecting from MongoDB...")
    logger.info("Closing server instance...")
    server.close()
    mongoose.connection.close()
})
