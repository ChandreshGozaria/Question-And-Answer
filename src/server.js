const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Question = require("./models/question");
const User = require('./models/user');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy

const initializePassport = require('./utils/passport-config');

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
  async function(username, password, done) {
    await mongoose.model('User').findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { 
        return done(null, false, {message: "Incorrect username. "}); 
      }
      if (!user.password == password) { 
        return done(null, false, { message: "Incorrect Password. "}); 
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser( async(id, done) => {
  await User.findById(id, (err, user) => {
    if(err) return done(null, false)
    return done(null, user)
  })
})

const port = process.env.PORT || 3000;

dotenv.config();

// Middeleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

app.use(flash())


//Database connection 
mongoose.connect(`${process.env.database}`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err))

// User registion 
app.post('/api/registion', async(req, res) => {
    try {
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let addUser = new User({
            username : req.body.username,
            password : hashedPassword
        })
        let saveUser = await addUser.save()
        res.status(200).send(saveUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

app.post('/api/login', 
  passport.authenticate('local'),
  function(req, res) {
    console.log('res.user', res.user)
    res.send(res.user);
  });

app.get('/api/getQuestion', (req, res) => {
    req.params
    res.send('Get all question ...');
});

app.post('/api/addQuestion', async (req , res) => {
    
    try {
        
        let addQuestion = new Question({
            questionTitle : req.body.title
        })
        let saveQuestion = await addQuestion.save()
        res.status(200).send(saveQuestion);
    } catch (error) {
        res.status(400).send(error.message);
    }
})


app.listen(port, () => {
    console.log(`server running on port ${port}`);
})