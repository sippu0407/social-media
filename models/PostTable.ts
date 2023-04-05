import mongoose , {Model, Schema} from 'mongoose';
import {IPost} from "./IPost";

const postSchema:Schema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'user' , required : true},
    text : {type : String, required: true},
    image : {type : String, required: true},
    name : {type : String, required: true},
    avatar : {type : String, required: true},
    likes : [
        {
            user : {type : mongoose.Schema.Types.ObjectId , ref : 'user'}
        }
    ],
    comments : [
        {
            user : {type : mongoose.Schema.Types.ObjectId , ref : 'user'},
            text : {type : String, required: true},
            name : {type : String, required: true},
            avatar : {type : String, required: true},
            date : {type : String, required: true},
        }
    ]
}, {timestamps : true});
const PostTable:Model<IPost> = mongoose.model('post' , postSchema);
export default  PostTable;