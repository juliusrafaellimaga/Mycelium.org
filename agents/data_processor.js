/**
 * Data Processing Agent
 * Specialized agent for data transformation, aggregation, and analysis
 */

const { AgentManager } = require('../agents.js');

class DataProcessorAgent {
    constructor(agentId, config = {}) {
        this.agentId = agentId;
        this.config = {
            batchSize: config.batchSize || 100,
            processingTimeout: config.processingTimeout || 5000,
            retryAttempts: config.retryAttempts || 3,
            ...config
        };
        this.queue = [];
        this.isProcessing = false;
    }

    /**
     * Initialize the agent
     */
    async init(agentManager) {
        this.agentManager = agentManager;
        agentManager.registerAgent(this.agentId, {
            name: `Data Processor - ${this.agentId}`,
            type: 'data_processing',
            config: this.config
        });
        
        agentManager.addLog(this.agentId, 'info', 'Data processor agent initialized');
    }

    /**
     * Process a batch of data
     */
    async processBatch(data) {
        return new Promise(async (resolve, reject) => {
            const startTime = Date.now();
            this.agentManager.setAgentState(this.agentId, 'active');

            try {
                // Process data
                const processed = this._transformData(data);
                const validated = this._validateData(processed);
                const aggregated = this._aggregateData(validated);

                const processingTime = Date.now() - startTime;
                
                this.agentManager.addLog(
                    this.agentId,
                    'info',
                    `Processed batch: ${data.length} items in ${processingTime}ms`
                );

                this.agentManager.setAgentState(this.agentId, 'idle');
                resolve({
                    success: true,
                    itemsProcessed: aggregated.length,
                    processingTime,
                    data: aggregated
                });
            } catch (error) {
                this.agentManager.addLog(
                    this.agentId,
                    'error',
                    `Batch processing failed: ${error.message}`
                );
                this.agentManager.setAgentState(this.agentId, 'error');
                reject(error);
            }
        });
    }

    /**
     * Transform data using configured rules
     */
    _transformData(data) {
        return data.map(item => ({
            ...item,
            transformed: true,
            timestamp: new Date()
        }));
    }

    /**
     * Validate data against schema
     */
    _validateData(data) {
        return data.filter(item => {
            // Basic validation - can be extended
            return item && typeof item === 'object';
        });
    }

    /**
     * Aggregate processed data
     */
    _aggregateData(data) {
        return data.reduce((acc, item) => {
            const key = item.category || 'unknown';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    }

    /**
     * Get agent metrics
     */
    getMetrics() {
        const agent = this.agentManager.getAgent(this.agentId);
        return {
            agentId: this.agentId,
            state: agent?.state,
            config: this.config,
            queueLength: this.queue.length,
            isProcessing: this.isProcessing
        };
    }
}

module.exports = DataProcessorAgent;
