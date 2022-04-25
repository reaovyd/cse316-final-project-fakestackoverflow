const unknownEndpoint = (req, res, next) => {
    res.status(404).json({
        error : "unknown endpoint"
    })
}

const runtimeError = (err, req, res, next) => {
    res.status(400).json({
        message: err.message,
        error : err.name
    })
}

module.exports = { unknownEndpoint, runtimeError }
