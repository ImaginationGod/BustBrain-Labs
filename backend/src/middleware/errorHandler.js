// Handle 404 - Not Found
export function notFound(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// General Error Handler
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    const statusCode = res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

    res.status(statusCode);

    res.json({
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
}
