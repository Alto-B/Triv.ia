const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");

const database = require('./config/database')
const { validate } = require('./src/utilities/token')
const router = require('./src/api/routes')

const app = express()
const port = 5000;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validate)
app.use(router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})