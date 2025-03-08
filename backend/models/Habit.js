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
    done: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Habit', HabitSchema);