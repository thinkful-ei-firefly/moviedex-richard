require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');


const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(function validateBearerToken(req, res, next) {
    // const bearerToken = req.get('Authorization').split(' ')[1]
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res
                .status(401)
                .json({error: 'Unauthorized request'})
    }
    next()
});

const movies = require('./moveis-data-small.json');

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log('Express server is listening on port 8000');
});

app.get('/', (req, res) => {
    res.send("Hello Express")
});

function handleGetMovies(req, res) {

    const searchGenre = req.query.genre
    const searchCountry = req.query.country
    const searchVote = req.query.avg_vote

    let results = movies;

    if(searchGenre) {
        results = results.filter(movie => movie.genre.toLowerCase().includes(searchGenre.toLowerCase()));
        res
            .json(results);
    }
    if(searchCountry) {
        results = results.filter(movie => movie.country.toLowerCase().includes(searchCountry.toLowerCase()));
        res
            .json(results);
    }
    if(searchVote) {
        results = results.filter(movie => Number(movie.avg_vote) >= Number(searchVote));
        res
            .json(results);

    }
}

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  });

app.use(cors());

app.get('/movie', handleGetMovies);

