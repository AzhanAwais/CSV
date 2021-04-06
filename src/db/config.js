
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', 
{useNewUrlParser: true, useUnifiedTopology: true}
).then(()=>{
    console.log("DB connect successfull")
}).catch((e)=>{
    console.log("DB connection Error")
})

module.exports=mongoose;
