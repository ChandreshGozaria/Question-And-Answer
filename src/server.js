const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Question = require("./models/question");

// Import passport & Local strategy
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const flash = require('express-flash');
const session = require('express-session');

const port = process.env.PORT || 3000;

//Database connection 
mongoose.connect(`${process.env.database}`)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err))


// MongoDB Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  join_date: { type: Date, default: Date.now }
});

// Initialize model
const User = mongoose.model('User', userSchema);

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: false
}))


// Initialize passport middleware
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
  async function (username, password, done) {
    await mongoose.model('User').findOne({ username: username },async function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: "Incorrect username. " });
      }
      console.log('user.password', user.password);
      // console.log('Current use password', await bcrypt.hash(password, 10))
      // console.log('Password Match: ', (!(user.password == password)));
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect Password. " });
      }
      return done(null, user);
    });
  }
));

// Serialization
passport.serializeUser((user, done) => {
  if (user) {
    return done(null, user.id)
  }
  return done(null, false)
})

// Deserialization
passport.deserializeUser(async (id, done) => {
  await User.findById(id, (err, user) => {
    if (err) return done(null, false)
    return done(null, user)
  })
})


// Middeleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(flash())



// User registion 
app.post('/api/register', async (req, res, done) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    User.findOne({ username: req.body.username }, (err, user) => {
      if (err) done(null, false, { message: err.message })
      else if (user) return res.send('Username exist..')
      else {
        User.create({ username: req.body.username, password: hashedPassword }, (err, user) => {
          if (err) done(null, false)
          return res.status(200).send(user);
        })
      }
    })
  } catch (error) {
    res.status(400).send(error.message);
  }
})

// Login - Passport.authenticate
app.post('/api/login',
  passport.authenticate('local'),
  function (req, res) {
    console.log('res.user', res.user)
    res.send(req.user);
  });

app.get('/api/getQuestion', (req, res) => {
  req.params
  res.send('Get all question ...');
});

app.post('/api/addQuestion', async (req, res) => {

  try {

    let addQuestion = new Question({
      questionTitle: req.body.title
    })
    let saveQuestion = await addQuestion.save()
    res.status(200).send(saveQuestion);
  } catch (error) {
    res.status(400).send(error.message);
  }
})

app.get('/api/test', isAuthenticated, (req, res) => {
  req.session.test ? req.session.test++ : req.session.test = 1;
  res.send(req.session.test.toString() + " " + req.user.username);
})

// Logout
app.post('/api/logout', (req, res) => {
  req.logout(() => {
    console.log('User logged Out.')
  });
  res.send("Logged out");
})

function isAuthenticated(req, res, done) {
  if (req.user) {
    return done();
  }
  return false;
}


app.listen(port, () => {
  console.log(`server running on port ${port}`);
})