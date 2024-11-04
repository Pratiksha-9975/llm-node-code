const mongoose= require("mongoose");

//create schema--what are the fields we required
const UserSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        
    },
    domain:{
        type:String,
        required:true,
    }
},
{timestamps:true});


//create Model -- to store the data

const UserModel= mongoose.model("student-datas", UserSchema);

module.exports=UserModel;
