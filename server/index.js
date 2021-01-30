const express = require('express')
const cors = require('cors')
const database = require('./config/database')

const app = express()
const port = 5000;

app.use(cors())

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})