import mongoose, { Schema } from "mongoose";


export const meeting =mongoose.model(
    'meeting',new Schema({
        user_id:{type:String},
        meetingCode:{type:String,required:true},
        date:{type:Date,default:Date.now,required:true}
    })
    
)