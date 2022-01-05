const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');

const PORT = 3000;
const CONN_URL = 'mongodb://localhost:27017/movies';

mongoose.connect(CONN_URL);
mongoose.connection.once('open', () => console.log('Connected to Mongo'));

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => console.log(`Server up on ${PORT}`));