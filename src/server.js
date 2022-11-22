const express = require("express");
const app = express();
const port = process.env.PORT || 3000;


// Middeleware
app.use(express.json());

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