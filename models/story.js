// require mongoose
var mongoose = require("mongoose");
// create schema class
var Schema = mongoose.Schema;

// create story schema
var StorySchema = new Schema({
	title: {
		type: String,
		required: true
	},
	// link is a required string
	link: {
		type: String,
		required: true
	},
	// this only saves one Comment's ObjectId, ref refers to the Comment model
	Comment: {
		type: Schema.Types.ObjectId,
		ref: "Comment"
	}
});

// create the Story model with the StorySchema
var Story = mongoose.model("Story", StorySchema);

// export the model
module.exports = Story;