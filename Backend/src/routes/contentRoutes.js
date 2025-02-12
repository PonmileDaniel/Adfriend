const express = require('express');
const router = express.Router();
const { getContent } = require('../controllers/contentController');

router.get('/get-content', getContent);

module.exports = router;