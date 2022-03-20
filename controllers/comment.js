// depenencies
const express = require('express')
const mongoose = require('mongoose')


const Stock = require('../models/stock')

// router
const router = express.Router()

// routes 
router.post('/:ticker', (req, res)=>{
    const ticker = req.params.ticker
    console.log('first comment body', req.body)

    req.body.author = req.session.userId
    console.log('updated comment body', req.body)

})

// Export the Router
module.exports = router