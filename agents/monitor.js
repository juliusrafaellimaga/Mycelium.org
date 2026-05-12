/**
 * Monitoring Agent
 * Tracks system health, agent performance, and generates alerts
 */

class MonitoringAgent {
    constructor(agentId, config = {}) {
        this.agentId = agentId;
        this.config = {
            checkInterval: config.checkInterval || 5000,
            alertThreshold: config.alertThreshold || 80,
            memoryLimit: config.memoryLimit || 500, // MB
            ...config
        };
        this.metrics = new Map();
        this.alerts = [];
        this.isMonitoring = false;
    }

    /**
     * Initialize the monitoring agent
     */
    async init(agentManager) {
        this.agentManager = agentManager;
        agentManager.registerAgent(this.agentId, {
            name: `Monitoring Agent - ${this.agentId}`,
            type: 'monitoring',
            config: this.config
        });

        agentManager.addLog(this.agentId, 'info', 'Monitoring agent initialized');
        this.startMonitoring();
    }

    /**
     * Start continuous monitoring
     */
    startMonitoring() {
        this.isMonitoring = true;
        this.agentManager?.setAgentState(this.agentId, 'active');
        
        this.monitoringInterval = setInterval(() => {
            this.collectMetrics();
        }, this.config.checkInterval);

        this.agentManager?.addLog(this.agentId, 'info', 'Monitoring started');
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        this.isMonitoring = false;
        clearInterval(this.monitoringInterval);
        this.agentManager?.setAgentState(this.agentId, 'idle');
        this.agentManager?.addLog(this.agentId, 'info', 'Monitoring stopped');
    }

    /**
     * Collect system and agent metrics
     */
    collectMetrics() {
        const agents = this.agentManager?.getAllAgents() || [];
        
        const systemMetrics = {
            timestamp: new Date(),
            agentCount: agents.length,
            activeAgents: agents.filter(a => a.state === 'active').length,
            errorAgents: agents.filter(a => a.state === 'error').length,
            agents: agents.map(agent => ({
                id: agent.id,
                state: agent.state,
                logsCount: agent.logs?.length || 0,
                requestsProcessed: agent.metrics?.requestsProcessed || 0,
                errorCount: agent.metrics?.errorCount || 0
            }))
        };

        this.metrics.set('system', systemMetrics);
        this._checkThresholds(systemMetrics);
    }

    /**
     * Check against alert thresholds
     */
    _checkThresholds(metrics) {
        const errorPercentage = metrics.agentCount > 0 
            ? (metrics.errorAgents / metrics.agentCount) * 100 
            : 0;

        if (errorPercentage > this.config.alertThreshold) {
            this._createAlert(
                'high_error_rate',
                `High error rate detected: ${errorPercentage.toFixed(2)}%`
            );
        }

        if (metrics.activeAgents === metrics.agentCount && metrics.agentCount > 0) {
            this._createAlert(
                'all_agents_active',
                'All agents are currently active - potential load concern'
            );
        }
    }

    /**
     * Create alert
     */
    _createAlert(alertType, message) {
        const alert = {
            id: `alert-${Date.now()}`,
            type: alertType,
            message,
            timestamp: new Date(),
            resolved: false
        };

        this.alerts.push(alert);
        this.agentManager?.addLog(
            this.agentId,
            'warn',
            `ALERT [${alertType}]: ${message}`
        );

        // Keep only last 100 alerts
        if (this.alerts.length > 100) {
            this.alerts.shift();
        }
    }

    /**
     * Get current metrics
     */
    getMetrics() {
        return this.metrics.get('system') || {};
    }

    /**
     * Get active alerts
     */
    getAlerts(unresolved = true) {
        if (unresolved) {
            return this.alerts.filter(a => !a.resolved);
        }
        return this.alerts;
    }

    /**
     * Resolve alert
     */
    resolveAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.resolved = true;
            this.agentManager?.addLog(this.agentId, 'info', `Alert resolved: ${alertId}`);
            return true;
        }
        return false;
    }

    /**
     * Generate health report
     */
    generateHealthReport() {
        const metrics = this.getMetrics();
        const alerts = this.getAlerts(true);

        return {
            timestamp: new Date(),
            healthStatus: alerts.length === 0 ? 'healthy' : 'warning',
            metrics,
            activeAlerts: alerts.length,
            alerts
        };
    }
}

module.exports = MonitoringAgent;
