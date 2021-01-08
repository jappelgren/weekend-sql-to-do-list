const express = require('express');
const bodyParser = require('body-parser')

const PORT = 5000;
const app = express();

app.use(express.static('server/public'))

app.listen(PORT, () => {
    console.log('Listening on port: 5000')
})