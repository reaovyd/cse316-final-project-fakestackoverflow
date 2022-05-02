const jwt = require("jsonwebtoken")
const api = require("express").Router()
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
api.use(tokenMiddleware.getBearer)

api.post("/", async (req, res, next) => {
    const payload = jwt.verify(req.token, JWT_SECRET) 
    const resJSON = {
        message: "valid jwt",
        permission: payload.registered ? "user" : "guest",
        userid: payload.registered ? payload.id : undefined,
        username: payload.registered ? payload.username : undefined
    }
    if(resJSON.userid === undefined) {
        delete resJSON.userid
    }
    if(resJSON.username === undefined) {
        delete resJSON.username
    }
    res.status(200).json(resJSON)
})

module.exports = api
