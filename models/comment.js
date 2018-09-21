// require mongoose
var mongoose = require("mongoose");
// create a schema class
var Schema = mongoose.Schema;

// create the Comment schema
var CommentSchema = new Schema({
	// just a string
	title: {
		type: String
	},
	// just a string
	body: {
		type: String
	}
});

// mongoose will automatically save the ObjectIds of the Comments
// these ids are referred to in the article model

// create the Comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// export the Comment model
module.exports = Comment;

