
const mongoose=require('mongoose');
 
const QuestionSchema = new mongoose.Schema({
    questionTitle:String,
    date: {type: Date, default: Date.now}
});

module.exports =  mongoose.model('Question', QuestionSchema);
 
