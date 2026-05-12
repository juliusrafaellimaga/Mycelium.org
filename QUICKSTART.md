# Quick Start Guide

## Prerequisites

- Node.js 16+ or higher
- Python 3.11+ (for backend services)
- npm or yarn package manager
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/juliusrafaellimaga/Mycelium.org.git
cd Mycelium.org
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Install Python Dependencies (Optional)

```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
```

## Running the Server

### Development Mode

```bash
npm run dev
```

This will start the server with auto-reload on file changes.

### Production Mode

```bash
npm start
```

The server will be available at:
- **Landing Page**: http://localhost:5000
- **API Root**: http://localhost:5000/api
- **Project Data**: http://localhost:5000/project_data.json

## Accessing the Application

1. **Landing Page**: Open http://localhost:5000 in your browser
2. **Submit Inquiries**: Fill out the form on the landing page
3. **View API Documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Project Structure

```
Mycelium.org/
├── api/
│   ├── routes.js          # Main API routes
│   ├── inquiries.js       # Inquiry management
│   └── middleware.js      # Express middleware
├── agents/
│   ├── data_processor.js  # Data processing agent
│   ├── api_gateway.js     # API gateway agent
│   └── monitor.js         # Monitoring agent
├── config/
│   ├── agent_config.json  # Agent configurations
│   └── server_config.json # Server settings
├── data/
│   └── inquiries.json     # User inquiries storage
├── tests/
│   └── agents.test.js     # Test cases
├── index.html             # Landing page
├── project_data.json      # Project metadata
├── server.js              # Main server file
├── agents.js              # Agent manager
├── package.json           # Node.js dependencies
├── requirements.txt       # Python dependencies
└── .env.example           # Environment template
```

## Key Features

### Web Application
- ✅ Professional landing page with hero section
- ✅ Features showcase grid
- ✅ Agent types overview
- ✅ Inquiry form with validation
- ✅ Responsive design (mobile-friendly)

### API Endpoints
- ✅ Agent management (CRUD operations)
- ✅ Agent state management
- ✅ Logging and metrics
- ✅ Inquiry submission and tracking
- ✅ Health checks
- ✅ Statistics and reporting

### Backend Features
- ✅ Express.js REST API
- ✅ CORS support
- ✅ Rate limiting (1000 req/15 min)
- ✅ Request logging
- ✅ Error handling
- ✅ JSON data persistence

## API Usage Examples

### Submit an Inquiry

```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "inquiryType": "feature_request",
    "subject": "Feature Request",
    "message": "Request details"
  }'
```

### Get All Agents

```bash
curl http://localhost:5000/api/agents
```

### Get Inquiry Statistics

```bash
curl http://localhost:5000/api/stats/overview
```

## Testing

Run the test suite:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:

```bash
PORT=3001 npm start
```

### Missing Dependencies

Clear node_modules and reinstall:

```bash
rm -rf node_modules
npm install
```

### CORS Issues

The API includes CORS headers by default. If you encounter issues:

1. Check that your request includes proper `Content-Type` header
2. Verify the request origin is allowed
3. Check the API server is running

## Development Tips

1. **Hot Reload**: Use `npm run dev` for automatic server restart on changes
2. **API Testing**: Use tools like Postman or Thunder Client
3. **Browser DevTools**: Check Network tab for request details
4. **Logs**: Monitor console output for detailed request/response info

## Deployment

### Docker

Build the Docker image:

```bash
docker build -t mycelium-org .
```

Run the container:

```bash
docker run -p 5000:5000 mycelium-org
```

### Cloud Platforms

#### Heroku

```bash
git push heroku main
```

#### AWS, Azure, GCP

Follow platform-specific Node.js deployment guides.

## Support

For issues or questions:

1. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Visit the GitHub repository: https://github.com/juliusrafaellimaga/Mycelium.org
3. View Notion page: https://www.notion.so/Mycelium-Dividr-Project-349e2ad142e280d892c4d5e082bee850

## License

MIT License - See LICENSE file for details
