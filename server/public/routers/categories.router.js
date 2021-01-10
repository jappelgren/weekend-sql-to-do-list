const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js')

router.get('/', (req, res) => {
    let queryText = `SELECT * FROM "category";`

    pool.query(queryText)
        .then((result) => {
            res.send(result.rows)
        })
})

router.post('/', (req, res) => {

    let queryText = `
        INSERT INTO "category"(category)
        VALUES ($1);
        `
    pool.query(queryText, [req.body.category])
        .then((result) => {
            res.sendStatus(201)
        }).catch((err) => {
            console.log(err)
            res.sendStatus(500)
        })
})

router.delete('/:id', (req, res) => {
    let queryText = `
        DELETE FROM "category"
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

module.exports = router;