// Require all of the modules needed
var http = require('http');
var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Make an express app
var app = express();

// Tell express that the views will be in the vews folder
app.set("views", path.resolve(__dirname, "views"));
// And that the views will use the EJS engine
app.set("view engine", "ejs");

// Create a global array to store all of your entries in
var entries = [];
// Make this entries array available in all views
app.locals.entries = entries;

// Use Morgan to log every request that comes in
app.use(logger("dev"));

// This code populates a variable call req.body if the user submits a form
app.use(bodyParser.urlencoded({ extended: false }));

// Render the honepage (at views/index.ejs) when the site root is visited
app.get("/", function(request, response) {
    response.render("index");
});

// Render the new entry page (at views/index.ejs) when GETing the URl
app.get("/new-entry", function(request, response) {
    response.render("new-entry");
});

// Define a route handler when you POST to the "new-entry" URL in contrast to a get
// If a user submits a form with no title or content then a 400 error is thrown
// Else a new entry is added to the entries array and user is redirected to homepage
app.post("/new-entry", function(request, response) {
    if (!request.body.title || !request.body.body) {
        response.status(400).end("Entries must have a title and a body.");
        return;
    } 
    entries.push ({
        title: request.body.title,
        body: request.body.body,
        published: new Date()
    });
    response.redirect("/");
});


// Render a 404 if an unknown source is requested
app.use(function(request, response) {
    response.status(404).render('404');
});

// Start a server on port 3000
http.createServer(app).listen(process.env.PORT || 3000)