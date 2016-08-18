// server.js

// set up ====================

var express = require("express");
var app = express(); // create app with express
var mongoose = require("mongoose"); // mongoose for mongodb
var morgan = require("morgan"); // log requests to the console
var bodyParser = require("body-parser"); // pull information from HTML POST with express
var methodOverride = require("method-override"); // simulate DELETE and PUT with express

// configuration =================

// grab the MONGOLAB Enviorenment variable
mongoose.connect(process.env.MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.use(express.static(__dirname + "/public")); // set the static files location /public/img will be /img for user
app.use(morgan("dev")); // log every request in console
app.use(bodyParser.urlencoded({"extended":"true"})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: "application/vnd.api+json"})); // parse application/vnd.api+json as json
app.use(methodOverride());


// define model
var Todo = mongoose.model("Todo", {
    text : String
});

// api //
// get all todos 
app.get("/api/todos", function(req, res) {
    
    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
        // if there's an error retrieving, send the error. 
        if (err)
            res.send(err)
            
        res.json(todos); // return all todos in JSON format
    });
});

// create todo and send back all todos after creation

app.post("/api/todos", function(req, res){
  // create a todo, information comes from AJAX request from Angular
  Todo.create({
      text : req.body.text,
      done: false }, 
      function (err, todo) {
      if (err)
        res.send(err);
        
  // get and return all the todos after you create another  
  Todo.find(function(err, todos){
     if (err)
        res.send(err)
     res.json(todos);
    });
  });
  
});

// delete a todo
app.delete("/api/todos/:todo_id", function(req, res){
    Todo.remove({
        _id: req.params.todo_id},
    function(err, todo) {
        if (err)
        res.send(err);
    
    // get and return all the todos after you create another
    
    Todo.find(function(err, todos){
       if (err)
        res.send(err)
       res.json(todos);
    });
  });
});

// listen (start app with node server.js) ===========
app.get("*", function(req, res) {
   res.sendFile("./public/index.html", {"root": __dirname});  // load the single view file for Angular.
});
app.listen(process.env.PORT || 8080);
console.log("App is running");