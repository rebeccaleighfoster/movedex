require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require ('cors')
const helmet = require('helmet')
const data = require('./data')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
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

app.use((error, res) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)

const PORT = process.env.PORT || 8000

app.listen(PORT, () =>{
    console.log(`server listening at ${PORT}`)
})