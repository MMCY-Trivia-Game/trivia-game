require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConnection')


connectDB() //connect database
const app = express();

//middleware
app.use(express.json()); // req.body

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}/`)
})