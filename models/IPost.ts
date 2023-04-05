import mongoose , {Document} from "mongoose";

export interface IPost extends Document{
    _id? : string;
    user : mongoose.Schema.Types.ObjectId;
    text : string;
    image : string;
    name : string;
    avatar : string;
    likes : [
        {
            _id? : string;
            user : mongoose.Schema.Types.ObjectId;
        }
    ],
    comments : [
        {
            _id? : string;
            user : mongoose.Schema.Types.ObjectId;
            text : string;
            name : string;
            avatar : string;
            date : string;
        }
    ],
    createdAt? : string;
    updatedAt? : string;
}