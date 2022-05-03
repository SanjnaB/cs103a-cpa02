/*app.js - creating a movie app that lets users add & find movies to their personal list  */

/* first, load all the packages we will need */
const createError = require("http-errors"); // to handle the server errors
const express = require("express");
const path = require("path");  // to refer to local paths
const cookieParser = require("cookie-parser"); // to handle cookies
const session = require("express-session"); // to handle sessions using cookies
const debug = require("debug")("personalapp:server"); 
const layouts = require("express-ejs-layouts");
const axios = require("axios")


/* load the models here - if you have/need models */
const user = require("./models/User")
/* load the JSON objects here if you have them */


/* initialize the database*/ //require('dotenv').config();
const mongoose = require('mongoose');
const mongoose_URI = 'mongodb+srv://sanjnabandaru:cpa02password@cluster0.1kj9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect( mongoose_URI, { useNewUrlParser: true, useUnifiedTopology: true } );

const db = mongoose.connection; //connects to the database
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});

/* initialize the express server */
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(layouts);

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling using cookies
app.use(
  session({
    secret: "zzbbyanana789sdfa8f9ds8f90ds87f8d9s789fds", // this ought to be hidden in process.env.SECRET
    resave: false,
    saveUninitialized: false
  })
);

/* Setting the port */
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(process.env.PORT || 5000);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);

}
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;

/*Authentication*/
const auth = require('./routes/auth');
const Recipe = require("./models/Recipe");
const Favorite = require("./models/Favorite");
app.use(auth)

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/')
}

//Routing 
app.get("/", (req, res, next) => {
    res.render("login");
  });

app.get("/new", isLoggedIn, async(req,res,next)=> {
    res.render("new");
});


app.get("/home",isLoggedIn, async(req,res,next)=>{
    let userId = res.locals.user._id;  // get the user's id
    let items = await Recipe.find({userId:userId}); // lookup the user's movie items
    res.locals.items = items;  //make the items available in the view
    res.render("homepage");
});


app.post("/addRecipe",(req,res,next)=>{
  const userId = res.locals.user._id;
  const {recipe_name, recipe_cuisine} = req.body
  const newRecipe = new Recipe({
      userId:userId,
      Title:recipe_name,
      Cuisine: recipe_cuisine
  });

  newRecipe.save()
  res.redirect('/new')
});

app.post("/search",async (req,res,next)=>{
  let obj = JSON.parse(JSON.stringify(req.body));
  let recipe_title = obj.recipe_name
  let recipe = await Recipe.find({Title: {$regex: recipe_title}});
  res.locals.recipes = recipe;
  res.render("search_page",{recipes: recipe})

});
app.get("/about", (req,res,next)=>{
  res.render("about")

});

app.get("/favorites", (req,res,next)=>{
  res.render("favorites")
});

app.get("/favorites_page", async (req,res,next)=>{
  const userId = res.locals.user._id;
  let favorite = await Favorite.find({userId: userId});
  res.locals.favorites = favorite;
  res.render("favorites_page", {favorites:favorite})

});

app.post("/leave_favorites",(req,res,next)=>{
  const userId = res.locals.user._id;
  const {favorites} = req.body
  console.log(favorites)
  const newFavorite = new Favorite({
      userId:userId,
      Title:favorites
  });

  newFavorite.save()
    
  res.redirect("/favorites")
});
