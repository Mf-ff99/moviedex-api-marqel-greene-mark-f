// import express, morgan, helment, and cors, configure dotenv
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const movieDB = require('./movie-data.json')
const helmet = require('helmet')

//assign express() to a variabler
const app = express()
//app.use morgan, cors, helmet
app.use(morgan('dev'))
app.use(cors())
app.use(helmet())


//validate API Bearer token and use next() callback
app.use(function validateBearerToken(req, res, next) {
    //assign private API token to a variable
    const apiToken = process.env.API_TOKEN
    //assign authorization header to a variable
    const authToken = req.get('Authorization')
     //check if authToken is equal to private token
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        //if authToken is not equal to ApiToken, return an error
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })
  
//return the list of movies after client is validated
app.get('/movie', function handleGetMovies(req, res) {
    // const {genre, country, avg_vote} = req.query
    //assign database to a variable
    let response = [...movieDB]
    //check for queries and filter by query

    if (req.query.genre) {
        response = response.filter(movie =>
          movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
      }
    if(req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }
    if(req.query.avg_vote) {
        reponse = response.filter(movie => 
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        )
    }
    //return response
    res.json(response)
})


//Start server listening on port 8000
app.listen(8000, () => {
    console.log('server is listening at port 8000')
})