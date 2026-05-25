const express = require('express');
const router = express.Router();

const Book = require('../models/book');

router.get('/', (req, res) => {
  Book.find()
    .then(books => {
        res.json(books)
        })
    .catch(err => {
        res.status(400).json('Error: ' + err)
    });
});

router.post('/', (req, res) => {
    const book = new Book({
        title: req.body.title,
        description: req.body.description
    });

    book.save()
        .then(data => {
            res.json(data)
        })
        .catch(e => {
            res.json({ message: e.message })
        });
});

router.patch('/:id', (req, res) => {
    Book.updateOne({
        _id: req.params.id},
        { $set: {description: req.body.description} }
    )
    .then(data => {
        res.json(data);
    })
    .catch(e => {
        res.json({ message: e.message })
    });
});

router.delete('/:id', (req, res) => {
    Book.deleteOne({ 
        _id: req.params.id})
    .then(data => {
        res.json(data);
    })
    .catch(e => {
        res.json({ message: e.message })
    });
});

module.exports = router;
