const express = require('express');
const Token = require('../models/Token');
const router = express.Router();
 


router.post('/', async (req, res) => {
  try {
    const { token } = req.body;
console.log(token)
    // Duplicate token check
    const exists = await Token.findOne({ token });
    if (!exists) {
      await Token.create({ token });
      console.log('Token saved ✅:', token);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error saving token:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


 
module.exports = router;