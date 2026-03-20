require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

// Models
const User = require('./models/User');
const Resource = require('./models/Resource');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

/* ==============================
    ROOT & RESOURCE ROUTES
============================== */
app.get("/", (req, res) => {
    res.send("🚀 Study Collaboration Platform Backend Running");
});

app.get('/api/resources', async (req, res) => {
    try {
        const files = await Resource.find();
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch resources" });
    }
});

app.post('/api/resources', async (req, res) => {
    try {
        const { title, type } = req.body;
        const newResource = new Resource({ title, type });
        await newResource.save();
        res.json(newResource);
    } catch (err) {
        res.status(500).json({ error: "Failed to save resource" });
    }
});

/* ==============================
    DATABASE CONNECTION
============================== */
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
.then(() => console.log("✅ DATABASE CONNECTED: Study Platform Ready"))
.catch((err) => {
    console.error("❌ DATABASE ERROR:", err.message);
});

/* ==============================
    STUDY GROUP MODEL & ROUTES
============================== */
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: String,
    members: [String],
    createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model("Group", GroupSchema);

app.post("/api/groups", async (req, res) => {
    try {
        const newGroup = new Group(req.body);
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/groups", async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ==============================
    FILE UPLOAD (MULTER)
============================== */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({
        message: "File uploaded successfully!",
        file: req.file
    });
});

/* ==============================
    AUTHENTICATION ROUTES
============================== */

// Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "Student account created!" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});

// Login (FIXED: Flattened response for Frontend)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, isPremium: user.isPremium }, 
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: '24h' }
        );

        // Sending username at top level so AuthModal.js picks it up correctly
        res.json({ 
            token, 
            username: user.username, 
            isPremium: user.isPremium 
        });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

/* ==============================
    SOCKET.IO (REAL-TIME CHAT)
============================== */
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("👨‍🎓 Student connected:", socket.id);

    socket.on("join-group", (groupId) => {
        socket.join(groupId);
        console.log(`Student joined group: ${groupId}`);
    });

    socket.on("send-message", (data) => {
        io.to(data.groupId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Student disconnected");
    });
});

/* ==============================
    SERVER START
============================== */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

app.get('/api/groups/:groupId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    
    // Separate files for your "Shared Media" sidebar
    const files = messages.filter(m => m.isFile).map(m => m.fileData);
    
    res.json({ messages, files });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// B. SOCKET LOGIC: Save message when sent
io.on('connection', (socket) => {
  socket.on('join-group', (groupId) => {
    socket.join(groupId);
  });

  socket.on('send-message', async (msgData) => {
    try {
      // 1. Save to MongoDB
      const newMessage = new Message(msgData);
      await newMessage.save();

      // 2. Broadcast to everyone else in the group
      socket.to(msgData.groupId).emit('receive-message', msgData);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });
});