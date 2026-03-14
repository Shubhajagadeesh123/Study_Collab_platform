require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);
const Resource = require('./models/Resource');
// Middleware
app.use(cors());
app.use(express.json());

/* ==============================
   ROOT ROUTE
============================== */
app.get("/", (req, res) => {
    res.send("🚀 Study Collaboration Platform Backend Running");
});

app.get('/api/resources', async (req, res) => {
    const files = await Resource.find();
    res.json(files);
});

// Route to "upload" (simulated for now, saving to DB)
app.post('/api/resources', async (req, res) => {
    const { title, type } = req.body;
    const newResource = new Resource({ title, type });
    await newResource.save();
    res.json(newResource);
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
    console.error("❌ DATABASE ERROR:");
    console.error(err.message);
});

/* ==============================
   STUDY GROUP MODEL
============================== */
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: String,
    members: [String],
    createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model("Group", GroupSchema);

/* ==============================
   GROUP API ROUTES
============================== */

// Create Study Group
app.post("/api/groups", async (req, res) => {
    try {
        const newGroup = new Group(req.body);
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Groups
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
    res.json({
        message: "File uploaded successfully!",
        file: req.file
    });
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

    // Join study group room
    socket.on("join-group", (groupId) => {
        socket.join(groupId);
        console.log(`Student joined group: ${groupId}`);
    });

    // Send message to group
    socket.on("send-message", (data) => {
        io.to(data.groupId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Student disconnected");
    });
});

// Registration Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Student account created!" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, isPremium: user.isPremium }, "your_jwt_secret");
    res.json({ token, user: { username: user.username, isPremium: user.isPremium } });
});
/* ==============================
   SERVER START
============================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});