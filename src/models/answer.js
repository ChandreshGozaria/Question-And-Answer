
const mongoose=require('mongoose');
 
const AnswerSchema = new mongoose.Schema({
    questionTitle:String,
    date: {type: Date, default: Date.now}
});

module.exports =  mongoose.model('Answers', AnswerSchema);
 
