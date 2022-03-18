// Import Dependencies
const express = require('express')
const Stock = require('../models/stock')
const axios = require('axios')
const { Query } = require('../models/connection')
const { response } = require('express')
require("dotenv").config()
// Create router
const router = express.Router()
const apiKey = process.env.API_KEY
// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

const reqUrlFront = 'https://api.stockdata.org/v1/data/quote?symbols='

let stockSymbol = 'NKE,AAPL,MSFT'

const reqUrlBack = `&api_token=${apiKey}`

// Routes

// index ALL

const requestUrl =`${reqUrlFront}${stockSymbol}${reqUrlBack}`

router.get('/', (req,res)=>{
	Stock.find({})
	axios(requestUrl)
		.then((responseData)=>{
			const stock = responseData.data.data
			console.log('this is the response date: \n', responseData)
			// return responseData.json()
			res.render('stock/index', {stocks: stock}) 
			// res.send(stockData)
			
		})
		
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
	
})

router.post('/stock', (req,res)=>{
	
	res.redirect()
})

// show route
router.get('/:stocktick', (req,res) => {
	const stockId = req.params.ticker
	console.log(stockId)
	Stock.find(stockId)

		.then((stock)=>{
			
			
			res.render('stock/show', {stocks: stock})
			
		})
		.catch(error =>{
			res.redirect(`/error?error=${error}`)
		})


})


module.exports = router
