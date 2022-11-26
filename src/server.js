const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Question = require("./models/question");
const User = require('./models/user');

const port = process.env.PORT || 3000;

dotenv.config();

// Middeleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

//Database connection 
mongoose.connect(`${process.env.database}`)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err))

// User registion 
app.post('/api/registion', async(req, res) => {
    try {
        
        let addUser = new User({
            username : req.body.username,
            password : req.body.password
        })
        let saveUser = await addUser.save()
        res.status(200).send(saveUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

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