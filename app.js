const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const boooks = require('./routes/books');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/books', boooks);

mongoose.connect(
    'mongodb+srv://fixer130404_db_user:2016J711%23rjha@damm20260.g5fr0ls.mongodb.net/=?retryWrites=true&w=majority&appName=damm20260')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Failed to connect to MongoDB: ' + err));

app.listen(4000);
