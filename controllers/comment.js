// depenencies
const express = require('express')
const mongoose = require('mongoose')


const Stock = require('../models/stock')

// router
const router = express.Router()

// routes 
// post route that creates a comment
router.post('/:ticker', (req, res)=>{
    const ticker = req.params.ticker
    console.log('first comment body', req.body)
    // adjust request body to have a user
    // the author's id will be logged in the users id
    req.body.author = req.session.userId
    console.log('this is the req params for ticker', ticker)
    console.log('updated comment body', req.body)
    // find the stock by the ticker
    Stock.findById(ticker)
    .then(stock => {
        stock.comments.push(req.body)
        // console.log('this it the comment', req.body)
        // save the stock
        return stock.save()
    })
    .then(stock =>{
        // redirect to the same page 
        res.redirect(`/stock/${stock.id}`)
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
    })

})

// Export the Router
module.exports = router