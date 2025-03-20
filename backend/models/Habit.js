const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    lastDone: {
        type: Date,
        default: Date.now
    },  
    days: {
        type: Number,
        default: 1
    },
    startedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Habit', HabitSchema);