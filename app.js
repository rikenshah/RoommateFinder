require('dotenv').config();
const express= require('express');
console.markTimeline(); exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const mongodb=require('mongodb');
var cookieParser = require('cookie-parser');
const app=express();
//var session = require('client-sessions');
const session = require('express-session');
var MemcachedStore = require('connect-memcached')(session);
const connection = connect();
//const port=5050;
const constant = require('./constants');

app.listen(process.env.PORT,()=>{
  console.log('Server started on port'+ process.env.PORT);
});

//Handlebars Middleware
app.set('views', './app/views/');
app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir:'app/views/layouts', partialsDir:'app/views/partials'}));
app.set('view engine', 'handlebars');
//Demo of deploying via heroku

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Map global promise- get rid of warning
mongoose.Promise= global.Promise;

// Connect to mongoDB
function connect () {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(()=> console.log('MongoDB connected')).catch(err=>console.log(err));
}

module.exports = {
  app,
  connect
};

// Load models
//require('./models/users');
//const User=mongoose.model('users');

require('./app/models/users');
const User=mongoose.model('users');
User.find({email: 'asundar2',password: 'Qwerty@123'},(err,docs)=>{
  if(err)
   console.log("error")
  console.log(docs)

})


require('./models/request');
const Request=mongoose.model('request');

// session
app.use(session({
  cookieName: 'session',
  resave: true,
  saveUninitialized: true,
  secret: 'highentropystring01010',
  duration: 30*60*1000*1000,
  activeDuration: 5*60*1000*1000,
}));

//app.use(function(req, res, next){
  //const session = req.session;
  //console.log(req.session);
  //next();
//});
// use css file
app.use(express.static("assets"));
app.use(express.static("assets/images"));

//routes
require('./routes')(app,User,mongoose,session);

// ************************************************************************
//Sign up successful view
 app.get('/users/successful',(req,res)=>{
  res.render('users/successful');
 });

//connect to userProfile/index
// app.get('/userProfile/index',(req,res)=>{
//   res.render('userProfile/index');
// });

 //Process Signup form
 app.post('/users',(req,res)=>{
  let errors=[];
  if(!req.body.firstname){
    errors.push({text: 'Please enter valid firstname'});
  }
  if(!req.body.lastname){
    errors.push({text: 'Please enter valid lastname'});
  }
  if(!req.body.gender){
    errors.push({text: 'Please enter a valid gender'});
  }
  if(!req.body.email){
    errors.push({text: 'Please enter a valid email'});
  }
  if(!req.body.phno){
    errors.push({text: 'Please enter a valid phone number'});
  }
  if(!req.body.password){
    errors.push({text: 'Please enter a valid password'});
  }
  if((req.body.password != req.body.confirmpassword)|| (!req.body.confirmpassword)){
    errors.push({text: 'Passwords don\'t match'});
  }
  if(!req.body.dietaryhabit){
    errors.push({text: 'Please enter your dietary habit'});
  }
  if(!req.body.smokinghabit){
    errors.push({text: 'Please enter your smoking habit'});
  }
  if(!req.body.alcoholichabit){
    errors.push({text: 'Please enter your alcoholic habit'});
  }
  if(!req.body.min_budget){
    errors.push({text: 'Please enter valid minbudget'});
  }
  if(!req.body.max_budget){
    errors.push({text: 'Please enter valid max budget'});
  }
  if(!req.body.room_sharing){
    errors.push({text: 'Please enter your roomsharing preference'});
  }
  if(!req.body.earliest_move_in_date){
    errors.push({text: 'Please enter your earliest move in date'});
  }
  if(!req.body.latest_move_in_date){
    errors.push({text: 'Please enter your latest move-in date'});
  }
if(errors.length>0){
  res.render('users/signup',{
    errors: errors,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    phno: req.body.phno,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
    dietaryhabit: req.body.dietaryhabit,
    smokinghabit: req.body.smokinghabit,
    alcoholichabit: req.body.alcoholichabit,
    min_budget: req.body.min_budget,
    max_budget: req.body.max_budget,
    room_sharing: req.body.room_sharing,
    earliest_move_in_date: req.body.earliest_move_in_date,
    latest_move_in_date: req.body.latest_move_in_date
  });
}else{
  const newUser={
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    phno: req.body.phno,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
    dietaryhabit: req.body.dietaryhabit,
    smokinghabit: req.body.smokinghabit,
    alcoholichabit: req.body.alcoholichabit,
    min_budget: req.body.min_budget,
    max_budget: req.body.max_budget,
    room_sharing: req.body.room_sharing,
    earliest_move_in_date: req.body.earliest_move_in_date,
    latest_move_in_date: req.body.latest_move_in_date
  }
  new User(newUser).save();
  res.render('users/successful')
}
 });

//sending request

 //Process
 app.post('/request',(req,res)=>{
  const newRequest={
  senderID:1234,
  receiverID:2345
  }
  new Request(newRequest).save();
  res.render('users/requestSuccessful')
});

 // Process signin form
 app.get('/loginsuccess',(req,res)=>{
 res.render('loginsuccess');
 });

 app.post('/',(req,res)=>{
   console.log("testing..");
 console.log(req.body.email);
 console.log(req.body.password);
  User.find({email: req.body.email,password: req.body.password}, function (err, docs) {
    if (docs.length){
     // req.session.user=docs;
     req.session.user=docs;
 //     res.render('loginsuccess');
        res.render('landing/landing',{answer: docs[0]});
        console.log(req.session.user);
    }else{
      let errors=[];
      errors.push({text:'Invalid Credentials'});
      res.render('/',{
        errors: errors
      });
      console.log('Signin failure');
    }
  });
 });

// Review-roomie page
app.get('/users/reviewroomie',(req,res)=>{
 res.render('users/reviewroomie');
});

//app.get('/signup',(req,res)=>{
 //  res.render('signup');
//});

app.get('/users/signup',(req,res)=>{
  res.render('users/signup');
});

//logout
app.get('/users/logout', function (req, res) {
  req.session.reset();
  res.render('users/logout');
});

app.get('/landing',(req,res)=>{
  res.render('landing/landing');
});


// app.get('/userProfile/editprofile',(req,res)=>{
//   res.render('userProfile/editprofile',{results: req.session.user[0]});
// });

// app.get('/search/search',(req,res)=>{
//   res.render('search/search');
// });
