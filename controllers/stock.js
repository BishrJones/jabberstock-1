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


let stockSymbol

const reqUrlBack = `&api_token=${apiKey}`

// Routes

// index ALL

router.get('/', (req, res)=>{
	req.body.owner = req.session.userId
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	res.render('stock/index', {username, loggedIn})
})


router.post('/search', (req,res)=>{
	// let stockSymbol = 'NKE'
	console.log('this is the search body',req.body)
	stockSymbol = req.body.search
	const requestUrl =`${reqUrlFront}${stockSymbol}${reqUrlBack}`
	axios(requestUrl)
		.then((responseData)=>{
			req.body.owner = req.session.userId
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const stock = responseData.data.data
			// console.log('this is the response date: \n', responseData)
			// return responseData.json()
			res.render('stock/index', {stocks: stock, username, loggedIn}) 
			// res.send(stockData)
			
		})
		
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
	
})

// index that shows only the user's stocks
router.get('/mine', (req,res)=>{
	// find the stock
	Stock.find({owner: req.session.userId})
	.then((stocks)=>{
		console.log('favorited stocks',stocks)
		const username = req.session.username
		const loggedIn = req.session.loggedIn
		res.render('stock/userStocks', {stocks, username, loggedIn})
	})
	.catch(error => {
		res.redirect(`/error?error=${error}`)
	})
})


// post route
// this route hits /stock
router.post('/', (req, res)=>{
	// console log req.body
	// const ticker = req.body.ticker
	req.body.owner = req.session.userId
	console.log('this is the request body',req.body)
	// if req.body looks right add stock.create and all then's and catches (promise chain)
	Stock.create(req.body)
		.then((stock)=>{
			console.log('this is returned from create', stock)
			res.redirect('/stock/mine')
			// res.redirect(`/stock/${stock.ticker}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:ticker', (req,res) => {
	const ticker = req.params.ticker

	const reqUrlFront = 'https://api.stockdata.org/v1/data/quote?symbols='

	const reqUrlBack = `&api_token=${apiKey}`
	const requestUrl =`${reqUrlFront}${ticker}${reqUrlBack}`
	
	axios(requestUrl)
	.then((responseData)=>{
			req.body.owner = req.session.userId
			const username = req.session.username
			const loggedIn = req.session.loggedIn 
			const stockResponse = responseData.data.data[0]
		
			console.log('This is the data of stock:',{stockResponse})
			// console.log('this is the response date: \n', responseData)
			// return responseData.json()
			res.render('stock/show', {stockResponse, username, loggedIn}) 
			// res.send(stockData)
			
		})
		
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})

})

router.delete('/:ticker', (req, res)=>{
	const ticker = req.params.ticker

	Stock.findByIdAndRemove(ticker)
	.then((stock)=>{
		console.log('this the rosponse from ticker', stock)
		res.redirect('/stock/mine')
	})
	.catch(error => {
		res.redirect(`/error?error=${error}`)
	})
})




 
module.exports = router
