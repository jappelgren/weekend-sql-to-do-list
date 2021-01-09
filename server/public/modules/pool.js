const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
});

pool.on('connect', () => {
    console.log('connected')
});

pool.on('error', () => {
    console.log(error)
});

module.exports = pool;