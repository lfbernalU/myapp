var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ message: 'Hello World' });
});

/* GET habits */

router.get('/habits', async function(req, res, next) {
  try {
      const habits = await Habit.find();
      res.json(habits);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
}
);


/* POST habits */

router.post('/habits', async function(req, res, next) {
    const { title, description } = req.body;
    const habit = new Habit({ title, description });
    try {
        await habit.save();
        res.json(habit);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

router.delete('/habits/:id', async function(req, res, next) {
    const { id } = req.params;
    try {
        await Habit.findByIdAndDelete(id);
        res.json({ message: 'Habit deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}   
);

module.exports = router;
