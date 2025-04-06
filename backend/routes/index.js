var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/* GET home page. */

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const tokenWithoutBearer = token.replace('Bearer ', '');
        const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

router.get('/',  function(req, res, next) {
  res.json({ message: 'Hello World' });
});


/* GET habits */

router.get('/habits', authenticateToken, async function(req, res) {
  try {

      let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({ error: 'Error retrieving habits' });

      const habits = await Habit.find({ userId:new mongoose.Types.ObjectId(userId) })

      res.json(habits);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}
);


/* POST habits */

router.post('/habits', authenticateToken, async function(req, res) {
    try {
        const { title, description } = req.body;
        let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({ error: 'Error creating habit' });
        userId = new mongoose.Types.ObjectId(userId);
        const habit = new Habit({ title, description, userId });
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(400).json({ message: "Error creating habit" });
    }
});


/* PUT habits */  

router.put('/habits/:id', async function(req, res, next) {
    const { id } = req.params;
    const { title, description, done } = req.body;
    try {
        const habit = await Habit.findById(id);
        if (title) {
            habit.title = title;
        }
        if (description) {
            habit.description = description;
        }
        if (done) {
            habit.done = done;
        }
        await habit.save();
        res.json(habit);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
);


/* DELETE habits */

router.delete('/habits/:id', authenticateToken, async function(req, res, next) {
    const { id } = req.params;
    try {
        await Habit.findByIdAndDelete(id);
        res.json({ message: 'Habit deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}   
);

router.patch('/habits/markasdone/:id', authenticateToken, async function(req, res) {

    const { id } = req.params;
    
    try {

        const habit = await Habit.findById(id);
        habit.lastDone = new Date();

        if (timeDiffenceInHours(habit.lastDone, habit.lastUpdated) < 24) {
            habit.lastUpdated = new Date();
            habit.days = timeDiffenceInDays(habit.lastDone, habit.startedAt);
            await habit.save();
            res.status(200).json({ message: 'Habit marked as done' });
        } else {
            habit.days = 1;
            habit.lastUpdated = new Date();
            habit.startedAt = new Date();
            await habit.save();
            res.status(200).json({ message: 'Habit restarted' });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});


const timeDiffenceInHours = (date1, date2) => {
    const diff = Math.abs(date1 - date2);
    return diff / (1000 * 60 * 60);
};


const timeDiffenceInDays = (date1, date2) => {
    const diff = Math.abs(date1 - date2);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

module.exports = router;
