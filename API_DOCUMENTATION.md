# API Documentation

## Overview

The Mycelium.org API provides comprehensive endpoints for agent management, monitoring, and user inquiries. All responses are in JSON format.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, most endpoints do not require authentication. Protected endpoints will require an `Authorization` header with a bearer token:

```
Authorization: Bearer <token>
```

## Response Format

All API responses follow this standard format:

```json
{
  "status": "success|error",
  "message": "Optional message",
  "data": {}
}
```

## Endpoints

### Agent Management

#### Get All Agents
```
GET /api/agents
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "agent-1",
      "name": "Data Processor",
      "type": "data_processing",
      "state": "idle",
      "createdAt": "2024-05-12T10:00:00Z",
      "logs": [],
      "metrics": {}
    }
  ],
  "count": 1
}
```

#### Get Agent by ID
```
GET /api/agents/:agentId
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "agent-1",
    "name": "Data Processor",
    "type": "data_processing",
    "state": "idle"
  }
}
```

#### Register New Agent
```
POST /api/agents
Content-Type: application/json

{
  "agentId": "my-agent",
  "config": {
    "name": "My Agent",
    "type": "data_processing",
    "batchSize": 100
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "my-agent",
    "name": "My Agent",
    "type": "data_processing",
    "state": "idle",
    "createdAt": "2024-05-12T10:00:00Z"
  }
}
```

#### Update Agent State
```
PUT /api/agents/:agentId/state
Content-Type: application/json

{
  "state": "active|idle|error|inactive"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Agent state updated to active"
}
```

#### Get Agent Logs
```
GET /api/agents/:agentId/logs?limit=100
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "timestamp": "2024-05-12T10:00:00Z",
      "level": "info",
      "message": "Agent initialized"
    }
  ],
  "count": 1
}
```

#### Execute Task on Agent
```
POST /api/agents/:agentId/execute
Content-Type: application/json

{
  "taskId": "task-123",
  "payload": {
    "data": "example"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Task queued for execution",
  "taskId": "task-123",
  "agentId": "agent-1"
}
```

#### Delete Agent
```
DELETE /api/agents/:agentId
```

**Response:**
```json
{
  "status": "success",
  "message": "Agent deleted successfully"
}
```

### Inquiries

#### Submit Inquiry
```
POST /api/inquiries
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "phone": "+1-234-567-8900",
  "inquiryType": "feature_request|bug_report|partnership|support|general|other",
  "subject": "Inquiry subject",
  "message": "Detailed message"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Inquiry submitted successfully",
  "inquiry": {
    "id": "inq-1234567890",
    "timestamp": "2024-05-12T10:00:00Z",
    "status": "pending"
  }
}
```

**Status Codes:**
- `201`: Inquiry created successfully
- `400`: Missing required fields or invalid email
- `500`: Server error

#### Get All Inquiries (Admin)
```
GET /api/inquiries
```

**Response:**
```json
{
  "status": "success",
  "count": 5,
  "data": [
    {
      "id": "inq-1234567890",
      "timestamp": "2024-05-12T10:00:00Z",
      "status": "pending",
      "name": "John Doe",
      "email": "john@example.com",
      "inquiryType": "feature_request",
      "subject": "Add new feature",
      "message": "Message content"
    }
  ]
}
```

#### Get Inquiry by ID
```
GET /api/inquiries/:inquiryId
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "inq-1234567890",
    "timestamp": "2024-05-12T10:00:00Z",
    "status": "pending",
    "name": "John Doe",
    "email": "john@example.com",
    "inquiryType": "feature_request",
    "subject": "Add new feature",
    "message": "Message content"
  }
}
```

#### Update Inquiry Status
```
PUT /api/inquiries/:inquiryId/status
Content-Type: application/json

{
  "status": "pending|in_progress|resolved|closed"
}
```

**Valid Statuses:**
- `pending`: Initial status
- `in_progress`: Being handled
- `resolved`: Issue resolved
- `closed`: Archived

**Response:**
```json
{
  "status": "success",
  "message": "Inquiry status updated",
  "data": {
    "id": "inq-1234567890",
    "status": "in_progress",
    "updatedAt": "2024-05-12T10:15:00Z"
  }
}
```

#### Get Inquiry Statistics
```
GET /api/stats/overview
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 10,
    "byStatus": {
      "pending": 3,
      "in_progress": 2,
      "resolved": 4,
      "closed": 1
    },
    "byType": {
      "feature_request": 4,
      "bug_report": 3,
      "partnership": 2,
      "support": 1
    }
  }
}
```

### System

#### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-05-12T10:00:00Z",
  "uptime": 3600
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "status": "error",
  "message": "Too many requests. Please try again later."
}
```

### 500 Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Default**: 1000 requests per 15 minutes
- **Status Code**: `429` when limit exceeded

## CORS Headers

The API includes CORS headers for cross-origin requests:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept`

## Examples

### Using cURL

**Submit an inquiry:**
```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "inquiryType": "feature_request",
    "subject": "New Feature Request",
    "message": "Please add support for..."
  }'
```

**Get all agents:**
```bash
curl http://localhost:5000/api/agents
```

### Using JavaScript/Fetch

```javascript
// Submit inquiry
const inquiry = {
  name: "John Doe",
  email: "john@example.com",
  inquiryType: "feature_request",
  subject: "Feature Request",
  message: "Please add..."
};

fetch('/api/inquiries', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(inquiry)
})
.then(response => response.json())
.then(data => console.log(data));
```

## Support

For API support, please contact us through the web inquiry form or visit our GitHub repository.
