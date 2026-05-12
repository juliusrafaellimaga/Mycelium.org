/**
 * API Gateway Agent
 * Manages API request routing, load balancing, and request/response handling
 */

class APIGatewayAgent {
    constructor(agentId, config = {}) {
        this.agentId = agentId;
        this.config = {
            port: config.port || 3000,
            timeout: config.timeout || 30000,
            maxRetries: config.maxRetries || 3,
            rateLimit: config.rateLimit || 1000,
            ...config
        };
        this.routes = new Map();
        this.requestStats = {
            total: 0,
            successful: 0,
            failed: 0,
            totalTime: 0
        };
    }

    /**
     * Initialize the gateway
     */
    async init(agentManager) {
        this.agentManager = agentManager;
        agentManager.registerAgent(this.agentId, {
            name: `API Gateway - ${this.agentId}`,
            type: 'api_gateway',
            config: this.config
        });

        agentManager.addLog(this.agentId, 'info', `API Gateway initialized on port ${this.config.port}`);
    }

    /**
     * Register a route handler
     */
    registerRoute(method, path, handler) {
        const key = `${method}:${path}`;
        this.routes.set(key, handler);
        this.agentManager?.addLog(this.agentId, 'info', `Route registered: ${key}`);
    }

    /**
     * Handle incoming request
     */
    async handleRequest(method, path, headers, body) {
        const startTime = Date.now();
        this.requestStats.total++;
        this.agentManager?.setAgentState(this.agentId, 'active');

        const key = `${method}:${path}`;
        const handler = this.routes.get(key);

        if (!handler) {
            this.agentManager?.addLog(this.agentId, 'warn', `No handler found for ${key}`);
            this.agentManager?.setAgentState(this.agentId, 'idle');
            return {
                status: 404,
                body: { error: 'Route not found', path, method }
            };
        }

        try {
            const response = await handler(headers, body);
            const elapsed = Date.now() - startTime;

            this.requestStats.successful++;
            this.requestStats.totalTime += elapsed;

            this.agentManager?.addLog(
                this.agentId,
                'info',
                `Request processed: ${method} ${path} (${elapsed}ms)`
            );

            this.agentManager?.setAgentState(this.agentId, 'idle');
            return {
                status: 200,
                body: response,
                processingTime: elapsed
            };
        } catch (error) {
            this.requestStats.failed++;
            this.agentManager?.addLog(
                this.agentId,
                'error',
                `Request failed: ${method} ${path} - ${error.message}`
            );
            this.agentManager?.setAgentState(this.agentId, 'error');
            return {
                status: 500,
                body: { error: error.message }
            };
        }
    }

    /**
     * Get gateway statistics
     */
    getStatistics() {
        return {
            agentId: this.agentId,
            stats: this.requestStats,
            averageResponseTime: this.requestStats.total > 0 
                ? (this.requestStats.totalTime / this.requestStats.successful).toFixed(2)
                : 0,
            successRate: this.requestStats.total > 0
                ? ((this.requestStats.successful / this.requestStats.total) * 100).toFixed(2)
                : 0,
            registeredRoutes: this.routes.size
        };
    }

    /**
     * Get registered routes
     */
    getRoutes() {
        return Array.from(this.routes.keys());
    }
}

module.exports = APIGatewayAgent;
