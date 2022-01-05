const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('Director', directorSchema);