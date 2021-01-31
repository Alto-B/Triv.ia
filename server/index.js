const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");

const path = require("path");

const database = require('./config/database')
const socket = require('./src/socket/socket')
const router = require('./src/api/routes')

const { validate } = require('./src/utilities/token')

const app = express()
const port = 5000;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validate)

// Serve react app
app.use(express.static(path.join(__dirname, '../', "client-web", "build")));
app.use(express.static("public"));

app.use(router);

// React-client Route
app.get("/*", (req, res) => {
    const filePath = path.join(__dirname, '../', 'client-web', 'build', 'index.html');
    res.sendFile(filePath)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})