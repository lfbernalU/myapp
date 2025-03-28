var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, ) => {

  try {

      const { username, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ username, password: hashedPassword });
      await await user.save();

      res.status(201).json({message: 'User created successfully'});

  } catch (error) {
      res.status(500).json({ error: 'Error register user', message: error.message });
  }
});

router.post('/login', async (req, res) => {

  try {
    const { username, password } = req.body;

    // Search for user in the database

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('habbitToken', token, { 
      httpOnly: false, // true in production
      secure: false, // true in production 
      sameSite: 'Strict', // only send cookie if the URL is the same
      maxAge: 3600000 * 24 * 7 // 7 days
    });

    res.status(200).json({ message: 'User logged in successfully', token });
  
  } catch (error) {
    res.status(500).json({ error: 'Error login user', message: error.message });
  }

});

module.exports = router;
