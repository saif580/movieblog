var mongoose=require("mongoose");
 mongoose.connect(process.env.MONGOURI.replace("<password>",process.env.MONGOPASSWORD),{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
 }).then(function(){
     console.log("Databse connected successfully");
 }).catch(function(err){
     console.log(err.message);
 })