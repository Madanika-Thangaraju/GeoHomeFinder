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

// Health check
app.get('/', (req, res) => {
    res.send('GeoHome Chat Server is Running!');
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
