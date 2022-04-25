const validBody = (req, res, next) => {
    if(req.body.title === undefined || req.body.text === undefined || req.body.summary === undefined
    || req.body.tags === undefined || req.body.tags.length === 0) {
        const e = new Error("Missing body") 
        e.name = "MissingBodyError"
        throw e
    }
    next()
}

module.exports = { validBody }
