// import dependencies
const mongoose = require('./connection')

// import user model for populate
// const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const stockSchema = new Schema(
	{
		ticker: { type: String, required: true },
		name: { type: String, required: true },
        price: { type: Number, required: true },
		day_open: { type: Number, required: true },
		day_high: {type: Number, required: true},
		day_low: {type: Number, required: true},

	},
	{ timestamps: true }
)

const Stock = model('Stock', stockSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Stock
