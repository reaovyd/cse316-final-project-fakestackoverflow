const jwt = require("jsonwebtoken")
const api = require("express").Router()
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
api.use(tokenMiddleware.getBearer)

api.post("/", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET) 
    res.status(200).json({
        message: "valid jwt",
        permission: payload.registered ? "user" : "guest" 
    })
})

module.exports = api
