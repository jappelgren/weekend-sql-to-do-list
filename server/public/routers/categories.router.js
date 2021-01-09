const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')

router.get('/', (req, res) => {
    let queryText = `SELECT * FROM "category"`

    pool.query(queryText)
        .then((result) => {
            res.send(result.rows)
        })
})

module.exports = router;