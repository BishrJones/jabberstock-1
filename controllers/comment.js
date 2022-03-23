// depenencies
const express = require('express')
const res = require('express/lib/response')
const mongoose = require('mongoose')


const Stock = require('../models/stock')

// router
const router = express.Router()

// routes 
// post route that creates a comment
router.post('/:id', (req, res)=>{
    const ticker = req.params.id
    // console.log('first comment body', req.body)
    // adjust request body to have a user
    // the author's id will be logged in the users id
    req.body.author = req.session.userId
    // console.log('this is the req params for ticker', ticker)
    // console.log('updated comment body', req.body)
    // find the stock by the ticker
    Stock.findById(ticker)
    .then(stock => {
        // console.log(stock)
        stock.comments.push(req.body)
        
        // console.log('this it the comment', req.body)
        // save the stock
        return stock.save()
    })
    .then(stock =>{
        // redirect to the same page 
        res.redirect('/stock/mine')
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
    })

})

// Delete route
router.delete('/delete/:commId', (req, res)=>{
    const ticker = req.params.id
    console.log(commId)
    const commId = req.params.commId
    // find the stock
    Stock.findById(ticker)
        .then(stock =>{
            // 

            const theComment = stock.comments.id(commId)
            console.log('this is comments',theComment)
            
                // remove the comment with .remove 
            theComment.remove()
                // save the updated stock
            return stock.save()
        })
        .then(stock =>{
            // redirect to the my stocks page
            res.redirect('stock/mine')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

router.get('/:id/edit', (req, res)=>{
    const username = req.session.username
	const loggedIn = req.session.loggedIn
    res.render('stock/editComment', {username, loggedIn})
})

// update route  send a put route to database -> edit the comments
router.put('/:id', (req, res)=>{
    // get the id
    const commentId = req.params.id 
    console.log(commentId)
    // req.body.author = req.session.userId
    
        Stock.findByIdAndUpdate(commentId, req.body, { new: true })
        .then((comment)=>{
            console.log('the updated comment', comment)
            res.redirect('/stock/mine')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })

})

// Export the Router
module.exports = router