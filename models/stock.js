// import dependencies
const mongoose = require('./connection')

// import user model for populate
// const User = require('./user')

//  import the commentSchema
const commentSchema = require('./comment')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const stockSchema = new Schema(
	{
		ticker: { type: String, required: true },
		name: { type: String, required: true },
		
		owner: {
			// references the type 'objectId'
			type: Schema.Types.ObjectID,
			// references the model: 'User'
			ref: 'User'
			// now that we have an owner field, let's look and replace references to the username in our fruit controllers
		},
		comments: [commentSchema]
	},
	{ timestamps: true }
)

const Stock = model('Stock', stockSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Stock
