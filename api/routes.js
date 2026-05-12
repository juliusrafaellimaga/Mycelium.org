/**
 * API Routes - Main API endpoint definitions
 * Handles all HTTP routing and request forwarding to agents
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/agents
 * Retrieve all registered agents
 */
router.get('/agents', (req, res) => {
    try {
        const agents = global.agentManager?.getAllAgents() || [];
        res.json({
            status: 'success',
            data: agents,
            count: agents.length
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/agents/:agentId
 * Retrieve specific agent details
 */
router.get('/agents/:agentId', (req, res) => {
    try {
        const agent = global.agentManager?.getAgent(req.params.agentId);
        if (!agent) {
            return res.status(404).json({
                status: 'error',
                message: 'Agent not found'
            });
        }
        res.json({
            status: 'success',
            data: agent
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * POST /api/agents
 * Register a new agent
 */
router.post('/agents', (req, res) => {
    try {
        const { agentId, config } = req.body;
        if (!agentId || !config) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: agentId, config'
            });
        }
        const agent = global.agentManager?.registerAgent(agentId, config);
        res.status(201).json({
            status: 'success',
            data: agent
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * PUT /api/agents/:agentId/state
 * Update agent state
 */
router.put('/agents/:agentId/state', (req, res) => {
    try {
        const { state } = req.body;
        if (!state) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required field: state'
            });
        }
        global.agentManager?.setAgentState(req.params.agentId, state);
        res.json({
            status: 'success',
            message: `Agent state updated to ${state}`
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/agents/:agentId/logs
 * Retrieve agent logs
 */
router.get('/agents/:agentId/logs', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const logs = global.agentManager?.getLogs(req.params.agentId, limit) || [];
        res.json({
            status: 'success',
            data: logs,
            count: logs.length
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * DELETE /api/agents/:agentId
 * Delete an agent
 */
router.delete('/agents/:agentId', (req, res) => {
    try {
        const success = global.agentManager?.deleteAgent(req.params.agentId);
        if (!success) {
            return res.status(404).json({
                status: 'error',
                message: 'Agent not found'
            });
        }
        res.json({
            status: 'success',
            message: 'Agent deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * POST /api/agents/:agentId/execute
 * Execute a task on an agent
 */
router.post('/agents/:agentId/execute', (req, res) => {
    try {
        const { taskId, payload } = req.body;
        global.agentManager?.setAgentState(req.params.agentId, 'active');
        
        // Task execution logic would go here
        res.json({
            status: 'success',
            message: 'Task queued for execution',
            taskId,
            agentId: req.params.agentId
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        agents: global.agentManager?.getAllAgents().length || 0
    });
});

module.exports = router;
