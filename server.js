require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require ('cors')
const helmet = require('helmet')
const data = require('./data')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req,res,next){
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken){
        return res.status(401).json({ error: "Unauthorized request!" })
    }
    next()
})


app.get('/movies', function handleGetMovies(req, res){
    let response = data;

    if(req.query.genre){
        response = response.filter((currentelement) => currentelement.genre === req.query.genre)
    }

    if (req.query.country){
        response = response.filter((currentelement) => currentelement.country.toLowerCase() === req.query.country.toLowerCase())
    }

    if(req.query.avg_vote){
        response = response.filter((currentelement) => parseInt(currentelement.avg_vote) >= parseInt(req.query.avg_vote))
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () =>{
    console.log(`server listening at ${PORT}`)
})

/*Users can search for Movies by genre, country or avg_vote
The endpoint is GET /movie
The search options for genre, country, and/or average vote are provided in query string parameters.
When searching by genre, users are searching for whether the Movie's genre includes a specified string. The search should be case insensitive.
When searching by country, users are searching for whether the Movie's country includes a specified string. The search should be case insensitive.
When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal to the supplied number.
The API responds with an array of full movie entries for the search results
The endpoint only responds when given a valid Authorization header with a Bearer API token value.
The endpoint should have general security in place such as best practice headers and support for CORS.*/