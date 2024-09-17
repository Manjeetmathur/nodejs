const express = require('express');
const app = express();
const db = require("./db");
require('dotenv').config();
const passport = require('passport');

const localStrategy = require('passport-local').Strategy;
const Person = require('./models/Person')
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const logRequest = (res,req,next) => {
       console.log(`${new Date().toLocaleString()} Request Made to : ${req.originalUrl}`);
       next();
} 
app.use(logRequest);

passport.use(new localStrategy(async (userName,password,done) => {
       try {
              //.log('Received credentials : ', userName,password);

              const user = await Person.findOne({username : userName});

              if(!user){
                     return done(null,false,{message : 'incorrect username'})
              }
              const  isPasswordMatch = user.password === password ? true : false;

              if(isPasswordMatch){
                     return done(null,user)
              }
              else{
                     return done(null,false,{message : 'incorrect password'})
              }
       } catch (error) {
              return done(error)
       }
}))
const localAuth = passport.authenticate('local',{session:false})
app.use(passport.initialize());

app.get('/',localAuth, function(req,res){
       res.send("welcome");
})

const personRoutes = require('./routes/personRoutes')
app.use('/person',personRoutes);

const menuRoutes = require('./routes/menuRotues');

app.use('/Menu',menuRoutes);



app.listen(3000);
