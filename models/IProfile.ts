import mongoose , {Document} from 'mongoose';

export interface IExperience {
    _id? : string;
    title : string;
    company : string;
    location : string;
    from : string;
    to : string;
    current : boolean;
    description : string;
}
export interface IEducation {
    _id? : string;
    school : string;
    degree : string;
    fieldOfStudy : string;
    from : string;
    to : string;
    current : boolean;
    description : string;
}
export interface ISocial {
    youtube : string;
    twitter : string;
    facebook : string;
    linkedin : string;
    instagram : string;
}

export interface IProfile extends Document{
    user : mongoose.Schema.Types.ObjectId;
    _id? : string;
    name? : string;
    avatar? : string;
    company : string;
    website : string;
    location : string;
    designation : string;
    skills : string[];
    bio : string;
    githubUsername : string;
    experience : IExperience[],
    education : IEducation[],
    social : ISocial,
    createdAt? : string;
    updatedAt? : string;
}