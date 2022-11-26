const mongoose=require('mongoose');
 
const userSchema = new mongoose.Schema({
    username:String,
    password: String,
    join_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
 
