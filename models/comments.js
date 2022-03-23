// Dependencies
const mongoose = require('./connection')

const commentSchema = new mongoose.Schema({
    subject:{
        type: String,
        required: true
    },
    note:{
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
        required: true
    }
}, {
    timestamps:true
})

module.exports = commentSchema