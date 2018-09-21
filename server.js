
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// require Comment and story models
var Comment = require("./models/Comment.js");
var Story = require("./models/story.js");
// scraping tools
var request = require("request");
var cheerio = require("cheerio");
// mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");



mongoose.Promise = Promise;

// initialize express
var app = express();
var PORT = process.env.PORT || 3000;

// use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// make public a static dir
app.use(express.static("public"));

// database configuration with mongoose
mongoose.connect("mongodb://localhost/mnoire");
var db = mongoose.connection;

// show any mongoose errors
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

// once logged into the db through mongoose, log a success message
db.once("open", function () {
    console.log("Mongoose connection successful.");
});

// ROUTES

// simple index route
app.get("/", function (req, res) {
    res.send(index.html);
});

// a get request to scrape the website
app.get("/scrape", function (req, res) {
    // first, we grab the body of the html with request
    request("https://madamenoire.com", function (error, response, html) {
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        var results = [];

        // Select each element in the HTML body from which you want information.
        // Comment: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("h2").each(function (i, element) {

            var link = $(element).children().attr("href");
            var title = $(element).children().text();


            // using our story model, create a new entry
            // this effectivly passes the result object to the entry (and the title lin )
            var entry = new Story(result);

            // now, save that entry to the db
            entry.save(function (err, doc) {
                // log any errors
                if (err) {
                    console.log(error);
                }
                // or log the doc
                else {
                    console.log(doc);
                }
            });
        });


    });
    // tell the browser that we finished scraping the website
    res.send("Scrape complete.");
});

// this will get the story we scraped from the mongoDB
app.get("/story", function (req, res) {
    // grab every doc in the story array
    Story.find({}, function (error, doc) {
        // log any errors
        if (error) {
            console.log(error);
        }
        // otherwise send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});

// grab an story by its object id
app.get("/story:id", function (req, res) {
    // using the id passed in the id parameter, prepare a query that finds the matching one in our db
    
    Story.findOne({ "_id": req.params.id })
        // and populates all of the Comments associated with it
        .populate("Comment")
        // now execute our query
        .exec(function (error, doc) {
            // log any errors
            if (error) {
                console.log(error);
            }
            // otherwise send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

// create a new Comment or replace and existing Comment
app.post("/story/:id", function (req, res) {
    // create a new Comment and pass the req.body to the entry
    var newComment = new Comment(req.body);

    // and save the new Comment to the db
    newComment.save(function (error, doc) {
        // log any errors
        if (error) {
            console.log(error);
        }
        // otherwise
        else {
            // use the story id to find and update its Comment
            Story.findOneAndUpdate({ "_id": req.params.id }, { "Comment": doc._id })
                // execute the above query
                .exec(function (error, doc) {
                    // log any errors
                    if (error) {
                        console.log(error);
                    }
                    // otherwise send the document to the browser
                    else {
                        res.send(doc);
                    }
                });
        }
    });
});

app.post('/stoyed/:id', function(req, res) {
    Article.findOneAndUpdate({ '_id': req.params.id }, { "ignore": true }).exec(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
});

// listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});