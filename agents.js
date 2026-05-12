// Agents.js - Agent Management Logic

ntName}`, `<pre>${logs}</pre>`);
}

function getAgentConfigForm(agentName) {
    return `
        <div style="color: #f1f5f9; padding: 20px;">
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Confidence Threshold:</label>
                <input type="range" min="0" max="100" value="85" style="width: 100%;">
                <span>85%</span>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Processing Speed:</label>
                <select stydocument.addEventListener('DOMContentLoaded', function() {
    console.log('Agents page initialized');
    initializeAgentsPage();
});

function initializeAgentsPage() {
    setupTabFiltering();
    setupAgentCardInteractions();
    setupSearch();
}

function setupTabFiltering() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
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
        if (category === 'all') {
            card.style.display = 'flex';
        } else {
            // You could add data attributes to cards for filtering
            card.style.display = 'flex';
        }
    });
}

function setupAgentCardInteractions() {
    const configBtns = document.querySelectorAll('.agent-actions .btn-small');
    configBtns.forEach(btn => {
        if (btn.textContent.includes('Configure')) {
            btn.addEventListener('click', function() {
                const agentName = this.closest('.agent-card').querySelector('h3').textContent;
                configureAgent(agentName);
            });
        } else if (btn.textContent.includes('View Logs')) {
            btn.addEventListener('click', function() {
                const agentName = this.closest('.agent-card').querySelector('h3').textContent;
                viewAgentLogs(agentName);
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
                const agentDesc = card.querySelector('.agent-description').textContent.toLowerCase();
                
                if (agentName.includes(searchTerm) || agentDesc.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

function configureAgent(agentName) {
    console.log('Configuring agent:', agentName);
    showModal(`Configure ${agentName}`, getAgentConfigForm(agentName));
}

function viewAgentLogs(agentName) {
    console.log('Viewing logs for:', agentName);
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
