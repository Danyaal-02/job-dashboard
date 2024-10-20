const express = require('express');
const router = express.Router();
const { createJob, getJobs } = require('../controllers/jobController');
const auth = require('../middlewares/auth');

router.post('/', auth, createJob);
router.get('/', auth, getJobs);

module.exports = router;