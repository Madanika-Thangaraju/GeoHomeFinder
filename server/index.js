const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// In-memory storage for messages (for demonstration)
// In a real app, this would be a database like MySQL or MongoDB
const messages = [];

// In-memory user storage (for demonstration)
const users = [
    { id: 1, email: 'test@example.com', phone: '1234567890', password: 'password123', name: 'Test User' }
];

// Health check
app.get('/', (req, res) => {
    res.send('GeoHome Chat Server is Running!');
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Register endpoint
app.post('/users/register', (req, res) => {
    try {
        const { email, phone, password, name } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        // Check if user already exists
        if (users.find(u => u.email === email || u.phone === phone)) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = {
            id: users.length + 1,
            email,
            phone: phone || '',
            password, // In production, hash this!
            name
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: 'dummy_jwt_token_' + newUser.id,
            user: { id: newUser.id, email: newUser.email, phone: newUser.phone, name: newUser.name }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Login endpoint
app.post('/users/login', (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validation
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Identifier (email/phone) and password are required' });
        }

        // Find user by email or phone
        const user = users.find(u => u.email === identifier || u.phone === identifier);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check password (In production, use bcrypt!)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            message: 'Login successful',
            token: 'dummy_jwt_token_' + user.id,
            user: { id: user.id, email: user.email, phone: user.phone, name: user.name }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Get current user endpoint
app.get('/users/me', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Extract user ID from token (dummy implementation)
        const userId = parseInt(token.replace('dummy_jwt_token_', ''));
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({ success: true, user: { id: user.id, email: user.email, phone: user.phone, name: user.name } });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get message history for a property
app.get('/chat/messages/:propertyId', (req, res) => {
    const { propertyId } = req.params;
    console.log(`Fetching history for property: ${propertyId}`);
    const filteredMessages = messages.filter(m => String(m.propertyId) === String(propertyId));
    res.json({ success: true, data: filteredMessages });
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_chat', (propertyId) => {
        socket.join(`property_${propertyId}`);
        console.log(`User ${socket.id} joined chat for property ${propertyId}`);
    });

    socket.on('send_message', (data) => {
        // data: { propertyId, senderId, senderName, text, time, type, isUser }
        const newMessage = {
            id: Date.now().toString(),
            ...data,
            timestamp: new Date()
        };
        messages.push(newMessage);

        // Broadcast to everyone in the room
        io.to(`property_${data.propertyId}`).emit('receive_message', newMessage);
        console.log('Message sent:', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
