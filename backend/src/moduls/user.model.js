import mongoose, { Schema } from "mongoose";

const UserSchema=new Schema(
    {
        name:{type:String,required:true},
        username:{type:String,required:true,unique:true},
        password:{type:String},
        token:{type:String}
    }
)

export const User=mongoose.model("User",UserSchema);
