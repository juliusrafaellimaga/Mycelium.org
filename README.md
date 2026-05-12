# Mycelium.org

A comprehensive API agent management and workflow orchestration platform designed for the Mycelium ecosystem. This project provides a modular, scalable architecture for managing distributed API agents with real-time monitoring, logging, and configuration management, our core product is to demonstrate what is our proudct capable of, in order to expand the worldview of  users when using our application software.

## Features

- **Agent Management System**: Register, configure, and monitor API agents in real-time
- **Multi-Type Agent Support**: Data processing, API gateway, workflow, and monitoring agents 
- **Agents like A.R.T.H.U.R. and E.D.I.T.H**: is used to emphasize progress over mere performance, especially when tailoring to the users' needs in order to meet specific criteria
- **Event-Driven Architecture**: Emit and listen to agent lifecycle events
- **Comprehensive Logging**: Detailed logging for all agent operations
- **Metrics Collection**: Track request processing, errors, and performance metrics
- **Web Dashboard**: Intuitive interface for agent management and monitoring
- **MCP Integration**: Model Context Protocol support for extended capabilities
- **Use of DiviDr**: We use what is available to us, in order to complete the Mycelium project timeline
## Project Structure

```
Mycelium.org/
├── agents.js              # Core agent management system
├── devcontainer.json      # Development container configuration
├── mcp.json              # MCP server configuration
├── settings.json         # VS Code settings
├── argv.json             # VS Code argument configuration
├── api/                  # API endpoints (new)
│   ├── routes.js         # API route definitions
│   └── middleware.js     # Custom middleware
├── agents/               # Agent implementations (new)
│   ├── data_processor.js # Data processing agents
│   ├── api_gateway.js    # API gateway agents
│   └── monitor.js        # Monitoring agents
├── config/               # Configuration files (new)
│   ├── agent_config.json # Agent configurations
│   └── server_config.json # Server settings
└── tests/                # Unit and integration tests (new)
    └── agents.test.js    # Agent tests
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- Docker (for dev container)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/juliusrafaellimaga/Mycelium.org.git
cd Mycelium.org
```

2. Install dependencies (dev container):
```bash
pip install -r requirements.txt
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Development

### Using Dev Container

This project includes a dev container configuration for consistent development environments:

```bash
# Open in dev container
code-remote .
```

### Agent Development

Create new agents by extending the `AgentManager` class:

```javascript
const manager = new AgentManager();

manager.registerAgent('my-agent', {
    name: 'My Custom Agent',
    type: 'data_processing',
    config: {
        // Agent-specific configuration
    }
});
```

## Configuration

- **devcontainer.json**: Development environment setup
- **mcp.json**: MCP server configuration for Supabase integration
- **settings.json**: Code editor and formatter settings
- **argv.json**: VS Code launch arguments

## API Agents

### Types

1. **Data Processing**: Handle data transformation and analysis
2. **API Gateway**: Route and manage API requests
3. **Workflow**: Orchestrate multi-step workflows
4. **Monitoring**: Track system health and metrics

### Agent States

- `idle`: Ready but not processing
- `active`: Currently processing requests
- `error`: Encountered an error
- `inactive`: Not running

## Monitoring & Logging

All agents provide:
- Real-time state tracking
- Comprehensive logging with timestamps
- Performance metrics (response time, request count, error rate)
- Event-driven notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests, please do not hesitate to give us inquiries on our project, at 
https://www.notion.so/Mycelium-Dividr-Project-349e2ad142e280d892c4d5e082bee850