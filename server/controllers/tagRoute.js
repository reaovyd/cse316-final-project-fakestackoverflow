const api = require("express").Router()
const jwt = require("jsonwebtoken")
const Tag = require("../models/tagSchema")
const JWT_SECRET = require("../utils/config").JWT_SECRET
const tokenMiddleware = require("../utils/tokenMiddleware")
api.use(tokenMiddleware.getBearer)

api.get("/", async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const getAllTags = await Tag.find({}).populate("questions")
    res.status(200).json(getAllTags)
})

// TODO mayb?
api.get("/:id", async (req, res, next) => {
    jwt.verify(req.token, JWT_SECRET)
    const getAllTags = await Tag.findById(req.params.id).populate("questions")
    res.status(200).json(getAllTags)
})

module.exports = api
