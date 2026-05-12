/**
 * Agents Management System
 * Handles API agent lifecycle, configuration, and monitoring
 */

const AGENT_TYPES = {
    DATA_PROCESSING: 'data_processing',
    API_GATEWAY: 'api_gateway',
    WORKFLOW: 'workflow',
    MONITORING: 'monitoring'
};

const AGENT_STATES = {
    IDLE: 'idle',
    ACTIVE: 'active',
    ERROR: 'error',
    INACTIVE: 'inactive'
};

class AgentManager {
    constructor() {
        this.agents = new Map();
        this.eventEmitter = new EventTarget();
        this.config = {};
    }

    /**
     * Register a new API agent
     */
    registerAgent(agentId, agentConfig) {
        const agent = {
            id: agentId,
            name: agentConfig.name || agentId,
            type: agentConfig.type || AGENT_TYPES.WORKFLOW,
            state: AGENT_STATES.IDLE,
            config: agentConfig,
            createdAt: new Date(),
            logs: [],
            metrics: {
                requestsProcessed: 0,
                errorCount: 0,
                avgResponseTime: 0
            }
        };

        this.agents.set(agentId, agent);
        this.emit('agent-registered', { agentId, agent });
        console.log(`✓ Agent registered: ${agentId}`);
        return agent;
    }

    /**
     * Get agent by ID
     */
    getAgent(agentId) {
        return this.agents.get(agentId);
    }

    /**
     * Get all agents
     */
    getAllAgents() {
        return Array.from(this.agents.values());
    }

    /**
     * Update agent state
     */
    setAgentState(agentId, newState) {
        const agent = this.agents.get(agentId);
        if (agent) {
            agent.state = newState;
            this.emit('agent-state-changed', { agentId, state: newState });
        }
    }

    /**
     * Add log entry for agent
     */
    addLog(agentId, level, message) {
        const agent = this.agents.get(agentId);
        if (agent) {
            agent.logs.push({
                timestamp: new Date(),
                level,
                message
            });
        }
    }

    /**
     * Get agent logs
     */
    getLogs(agentId, limit = 100) {
        const agent = this.agents.get(agentId);
        return agent ? agent.logs.slice(-limit) : [];
    }

    /**
     * Event emission
     */
    emit(eventName, detail) {
        this.eventEmitter.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    /**
     * Event listener
     */
    on(eventName, callback) {
        this.eventEmitter.addEventListener(eventName, (e) => callback(e.detail));
    }

    /**
     * Remove event listener
     */
    off(eventName, callback) {
        this.eventEmitter.removeEventListener(eventName, callback);
    }

    /**
     * Delete agent
     */
    deleteAgent(agentId) {
        const success = this.agents.delete(agentId);
        if (success) {
            this.emit('agent-deleted', { agentId });
        }
        return success;
    }
}

// Initialize global agent manager
const agentManager = new AgentManager();

// DOM Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Agents page initialized');
    initializeAgentsPage();
});

function initializeAgentsPage() {
    setupTabFiltering();
    setupAgentCardInteractions();
    setupSearch();
    loadAgentMetrics();
}

function setupTabFiltering() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            filterAgents(category);
        });
    });
}

function filterAgents(category) {
    console.log('Filtering agents by category:', category);
    const cards = document.querySelectorAll('.agent-card');
    
    cards.forEach(card => {
        const agentType = card.getAttribute('data-type');
        if (category === 'all' || agentType === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupAgentCardInteractions() {
    const configBtns = document.querySelectorAll('.agent-actions .btn-small');
    configBtns.forEach(btn => {
        if (btn.textContent.includes('Configure')) {
            btn.addEventListener('click', function() {
                const agentId = this.closest('.agent-card').getAttribute('data-agent-id');
                configureAgent(agentId);
            });
        } else if (btn.textContent.includes('Logs')) {
            btn.addEventListener('click', function() {
                const agentId = this.closest('.agent-card').getAttribute('data-agent-id');
                viewAgentLogs(agentId);
            });
        }
    });
}

function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.agent-card');
            
            cards.forEach(card => {
                const agentName = card.querySelector('h3').textContent.toLowerCase();
                const agentDesc = card.querySelector('.agent-description')?.textContent.toLowerCase() || '';
                
                if (agentName.includes(searchTerm) || agentDesc.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

function configureAgent(agentId) {
    console.log('Configuring agent:', agentId);
    const agent = agentManager.getAgent(agentId);
    if (agent) {
        alert(`Configure ${agent.name}`);
    }
}

function viewAgentLogs(agentId) {
    console.log('Viewing logs for:', agentId);
    const logs = agentManager.getLogs(agentId);
    console.table(logs);
}

function loadAgentMetrics() {
    const agents = agentManager.getAllAgents();
    console.log('Current agents:', agents);
}
    const logs = generateMockLogs(agentName);
    showModal(`Logs - ${agele="width: 100%; padding: 8px; background-color: #334155; color: #f1f5f9; border: 1px solid #475569; border-radius: 6px;">
                    <option>Real-time</option>
                    <option>Balanced</option>
                    <option>High Quality</option>
                </select>
            </div>
            <button onclick="saveAgentConfig()" style="padding: 10px 20px; background-color: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">Save</button>
        </div>
    `;
}

function generateMockLogs(agentName) {
    const logs = [
        `[2024-04-28 14:35:22] INFO: ${agentName} started processing`,
        `[2024-04-28 14:35:23] DEBUG: Loading model weights...`,
        `[2024-04-28 14:35:24] INFO: Model loaded successfully (245ms)`,
        `[2024-04-28 14:35:25] DEBUG: Processing input data...`,
        `[2024-04-28 14:35:26] INFO: Processing complete (1.2s)`,
        `[2024-04-28 14:35:27] INFO: Results generated successfully`,
        `[2024-04-28 14:35:28] INFO: Task completed (2.5s total)`
    ];
    return logs.join('\n');
}

function saveAgentConfig() {
    console.log('Agent configuration saved');
    showNotification('Configuration saved successfully!', 'success');
    closeModal();
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.id = 'config-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #1e293b;
        border: 1px solid #475569;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #f1f5f9;">${title}</h2>
        ${content}
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('config-modal');
    if (modal) {
        modal.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
