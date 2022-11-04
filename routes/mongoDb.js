const express = require('express');
const router = express.Router();

router.post('/health', async (req, res) => {
    res.status(200).send('Healthy');
});

module.exports = router;