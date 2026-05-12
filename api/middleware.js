/**
 * API Middleware
 * Provides common middleware for API endpoints
 */

/**
 * Request logging middleware
 */
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
}

/**
 * CORS middleware
 */
function corsMiddleware(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
}

/**
 * JSON parsing middleware
 */
function jsonParser(req, res, next) {
    req.on('data', chunk => {
        req.rawBody = chunk;
    });
    next();
}

/**
 * Error handling middleware
 */
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
}

/**
 * Authentication middleware (placeholder)
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'No authentication token provided'
        });
    }

    // TODO: Verify token
    next();
}

/**
 * Rate limiting middleware
 */
function rateLimiter(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    const clients = new Map();

    return (req, res, next) => {
        const clientIp = req.ip;
        const now = Date.now();

        if (!clients.has(clientIp)) {
            clients.set(clientIp, []);
        }

        const clientRequests = clients.get(clientIp);
        const recentRequests = clientRequests.filter(time => now - time < windowMs);

        if (recentRequests.length >= maxRequests) {
            return res.status(429).json({
                status: 'error',
                message: 'Too many requests. Please try again later.'
            });
        }

        recentRequests.push(now);
        clients.set(clientIp, recentRequests);
        next();
    };
}

/**
 * Validation middleware
 */
function validateRequest(schema) {
    return (req, res, next) => {
        // TODO: Implement schema validation
        next();
    };
}

module.exports = {
    requestLogger,
    corsMiddleware,
    jsonParser,
    errorHandler,
    authenticateToken,
    rateLimiter,
    validateRequest
};
