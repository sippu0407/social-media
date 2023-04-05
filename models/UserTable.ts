import mongoose , {Schema, Model} from 'mongoose';
import {IUser} from "./IUser";

const useSchema:Schema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true , unique : true},
    password : {type : String, required : true},
    avatar : {type : String, required : true},
    isAdmin : {type : Boolean, default : false}
}, {timestamps : true});
const UserTable:Model<IUser> = mongoose.model('user', useSchema);
export default UserTable;