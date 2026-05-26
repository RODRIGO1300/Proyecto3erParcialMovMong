const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routes/users');
const products = require('./routes/products');
const categories = require('./routes/categories');
const orders = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/orders', orders);

mongoose.connect(
    'mongodb+srv://fixer130404_db_user:2016J711%23rjha@damm20260.g5fr0ls.mongodb.net/FinalProyect?retryWrites=true&w=majority&appName=damm20260')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Failed to connect to MongoDB: ' + err));

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
