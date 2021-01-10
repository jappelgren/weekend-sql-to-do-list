const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')

router.get('/', (req, res) => {
    let queryText = `SELECT * FROM "todo" ORDER BY "completed";`

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

router.delete('/:id', (req, res) => {
    let queryText = `
        DELETE FROM "todo"
        WHERE "id" = $1;
        `
    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.sendStatus(200)
        }).catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})


router.put('/:id', (req, res) => {
    let queryArr = [req.body.task, req.body.category, req.body.completeBy, req.params.id]
    let queryText = `
    UPDATE "todo"
    SET "task" = $1,
        "category" = $2,
        "complete_by" = $3
    WHERE "id" = $4;
    `
    console.log(req.body)
    if (req.body.completed) {
        queryText = `
        UPDATE "todo"
        SET "completed" = $1
        WHERE "id" = $2;
        `
        queryArr = [req.body.completed, req.params.id]
    }

    pool.query(queryText, queryArr)
        .then((result) => {
            res.sendStatus(200)
        }).catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})
module.exports = router;