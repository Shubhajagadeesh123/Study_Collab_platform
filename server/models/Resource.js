const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, default: 'PDF' }, // e.g., PDF, Video, Link
    url: { type: String }, // For when we add actual file storage later
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);