const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')

router.get('/', (req, res) => {
    let queryText = `SELECT * FROM "todo";`

    pool.query(queryText)
        .then((result) => {
            res.send(result.rows)
        }).catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})

router.post('/', (req, res) => {

    let queryArr = [req.body.task, req.body.category, req.body.dateAdded, req.body.completeBy]
    let queryText = `
        INSERT INTO "todo"(task, category, date_added, complete_by)
        VALUES ($1, $2, $3, $4);
        `
    pool.query(queryText, queryArr)
        .then((result) => {
            res.sendStatus(201)
        }).catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})

module.exports = router;