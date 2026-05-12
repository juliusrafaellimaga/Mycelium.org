/**
 * Inquiry Management API
 * Handles user inquiries from the website
 */

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Store inquiries in a JSON file (in production, use a database)
const INQUIRIES_FILE = path.join(__dirname, '../data/inquiries.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(path.dirname(INQUIRIES_FILE), { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Load inquiries from file
async function loadInquiries() {
    try {
        const data = await fs.readFile(INQUIRIES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save inquiries to file
async function saveInquiries(inquiries) {
    try {
        await ensureDataDir();
        await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving inquiries:', error);
        return false;
    }
}

/**
 * POST /api/inquiries
 * Submit a new user inquiry
 */
router.post('/inquiries', async (req, res) => {
    try {
        const { name, email, company, phone, inquiryType, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !inquiryType || !subject || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email format'
            });
        }

        // Create inquiry object
        const inquiry = {
            id: `inq-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'pending',
            name,
            email,
            company: company || 'N/A',
            phone: phone || 'N/A',
            inquiryType,
            subject,
            message,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        };

        // Load existing inquiries
        let inquiries = await loadInquiries();

        // Add new inquiry
        inquiries.push(inquiry);

        // Save to file
        await saveInquiries(inquiries);

        // Log inquiry
        global.agentManager?.addLog(
            'api-gateway-1',
            'info',
            `New inquiry received: ${inquiry.id} from ${name} (${email})`
        );

        // Send success response
        res.status(201).json({
            status: 'success',
            message: 'Inquiry submitted successfully',
            inquiry: {
                id: inquiry.id,
                timestamp: inquiry.timestamp,
                status: inquiry.status
            }
        });

    } catch (error) {
        console.error('Inquiry submission error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error processing inquiry'
        });
    }
});

/**
 * GET /api/inquiries
 * Retrieve all inquiries (admin only)
 */
router.get('/inquiries', async (req, res) => {
    try {
        // In production, add authentication/authorization checks here
        const inquiries = await loadInquiries();
        res.json({
            status: 'success',
            count: inquiries.length,
            data: inquiries
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving inquiries'
        });
    }
});

/**
 * GET /api/inquiries/:inquiryId
 * Retrieve specific inquiry
 */
router.get('/inquiries/:inquiryId', async (req, res) => {
    try {
        const inquiries = await loadInquiries();
        const inquiry = inquiries.find(i => i.id === req.params.inquiryId);

        if (!inquiry) {
            return res.status(404).json({
                status: 'error',
                message: 'Inquiry not found'
            });
        }

        res.json({
            status: 'success',
            data: inquiry
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving inquiry'
        });
    }
});

/**
 * PUT /api/inquiries/:inquiryId/status
 * Update inquiry status
 */
router.put('/inquiries/:inquiryId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'in_progress', 'resolved', 'closed'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status'
            });
        }

        let inquiries = await loadInquiries();
        const inquiry = inquiries.find(i => i.id === req.params.inquiryId);

        if (!inquiry) {
            return res.status(404).json({
                status: 'error',
                message: 'Inquiry not found'
            });
        }

        inquiry.status = status;
        inquiry.updatedAt = new Date().toISOString();

        await saveInquiries(inquiries);

        res.json({
            status: 'success',
            message: 'Inquiry status updated',
            data: inquiry
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating inquiry'
        });
    }
});

/**
 * GET /api/inquiries/stats/overview
 * Get inquiry statistics
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const inquiries = await loadInquiries();
        const stats = {
            total: inquiries.length,
            byStatus: {
                pending: inquiries.filter(i => i.status === 'pending').length,
                in_progress: inquiries.filter(i => i.status === 'in_progress').length,
                resolved: inquiries.filter(i => i.status === 'resolved').length,
                closed: inquiries.filter(i => i.status === 'closed').length
            },
            byType: inquiries.reduce((acc, i) => {
                acc[i.inquiryType] = (acc[i.inquiryType] || 0) + 1;
                return acc;
            }, {})
        };

        res.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving statistics'
        });
    }
});

module.exports = router;
