const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const port = process.env.PORT || 3000;

dotenv.config();

// Middeleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}))

//Database connection 
mongoose.connect(`${process.env.database}`);

// User registion 
app.post('/api/registion', async(req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password , 10);
        console.log(req.body);
    
        res.send(req.body)
    } catch (error) {
        
    }
})

app.get('/api/getQuestion', (req, res) => {
    req.params
    res.send('Get all question ...');
});

app.post('/api/addQuestion', (req , res) => {
    let data =  req.body;

    console.log('Data', data);
    res.send(data);
})


app.listen(port, () => {
    console.log(`server running on port ${port}`);
})