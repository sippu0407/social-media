import express, {raw} from 'express';
import ProfileTable from "../models/ProfileTable";
import verifyToken from "../middlewares/TokenVerifier";
import {body , validationResult} from 'express-validator';
import {IEducation, IExperience, IProfile} from "../models/IProfile";
import mongoose from 'mongoose';
import UserTable from "../models/UserTable";

const profileRouter:express.Router = express.Router();

/*
    @usage : Create a Profile
    @url : http://127.0.0.1:5000/api/profiles/
    @fields : company , website , location , designation , skills , bio ,
    githubUsername, youtube , facebook , twitter , linkedin , instagram
    @method : POST
    @access : PRIVATE
 */
profileRouter.post('/',[
    body('company').not().isEmpty().withMessage('Company is Required'),
    body('website').not().isEmpty().withMessage('Website is Required'),
    body('location').not().isEmpty().withMessage('Location is Required'),
    body('designation').not().isEmpty().withMessage('Designation is Required'),
    body('skills').not().isEmpty().withMessage('Skills is Required'),
    body('bio').not().isEmpty().withMessage('Bio is Required'),
    body('githubUsername').not().isEmpty().withMessage('GithubUsername is Required'),
    body('youtube').not().isEmpty().withMessage('YouTube is Required'),
    body('facebook').not().isEmpty().withMessage('Facebook is Required'),
    body('twitter').not().isEmpty().withMessage('Twitter is Required'),
    body('linkedin').not().isEmpty().withMessage('Linkedin is Required'),
    body('instagram').not().isEmpty().withMessage('Instagram is Required'),
] ,verifyToken , async (request:express.Request , response:express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {
        let requestedUser:any = request.headers['user'];

        let {company , website , location , designation , skills , bio, githubUsername ,
        youtube , facebook , twitter , linkedin , instagram} = request.body;

        let skillSet:string[] = skills.toString().split(',').map((skill: string) => skill.trim());
        let profileObj:any = {
            user : requestedUser?.id,
            company : company,
            website : website,
            location : location,
            designation : designation,
            githubUsername : githubUsername,
            bio : bio,
            skills : skillSet,
            experience : [] as IExperience[],
            education : [] as IEducation[],
        }
        // Social Object Creation
        profileObj.social = {};
        if(youtube) profileObj.social.youtube = youtube;
        if(facebook) profileObj.social.facebook = facebook;
        if(twitter) profileObj.social.twitter = twitter;
        if(linkedin) profileObj.social.linkedin = linkedin;
        if(instagram) profileObj.social.instagram = instagram;

        // save to db
        let profile = new ProfileTable(profileObj);
        profile = await profile.save();
        response.status(200).json({
            msg : 'Profile is Created Successfully',
            profile : profile
        });
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Get my Profile
    @url : http://127.0.0.1:5000/api/profiles/me
    @fields : no-fields
    @method : GET
    @access : PRIVATE
 */
profileRouter.get('/me', verifyToken, async (request:express.Request , response:express.Response) => {
    try {
        let requestedUser :any = request.headers['user'];
        let profile:IProfile | null = await ProfileTable.findOne({user : requestedUser.id}).populate('user', ['name' , 'avatar']);
        if(!profile){
            return response.status(500).json({
                errors : [
                    {
                        msg : 'No Profile Found for the User'
                    }
                ]
            });
        }
        response.status(200).json({
            profile : profile
        });
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Update a Profile
    @url : http://127.0.0.1:5000/api/profiles/
    @fields : company , website , location , designation , skills , bio ,
    githubUsername, youtube , facebook , twitter , linkedin , instagram
    @method : PUT
    @access : PRIVATE
 */
profileRouter.put('/',[
    body('company').not().isEmpty().withMessage('Company is Required'),
    body('website').not().isEmpty().withMessage('Website is Required'),
    body('location').not().isEmpty().withMessage('Location is Required'),
    body('designation').not().isEmpty().withMessage('Designation is Required'),
    body('skills').not().isEmpty().withMessage('Skills is Required'),
    body('bio').not().isEmpty().withMessage('Bio is Required'),
    body('githubUsername').not().isEmpty().withMessage('GithubUsername is Required'),
    body('youtube').not().isEmpty().withMessage('YouTube is Required'),
    body('facebook').not().isEmpty().withMessage('Facebook is Required'),
    body('twitter').not().isEmpty().withMessage('Twitter is Required'),
    body('linkedin').not().isEmpty().withMessage('Linkedin is Required'),
    body('instagram').not().isEmpty().withMessage('Instagram is Required'),
] ,verifyToken , async (request:express.Request , response:express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    try {
        let requestedUser:any = request.headers['user'];

        let {company , website , location , designation , skills , bio, githubUsername ,
            youtube , facebook , twitter , linkedin , instagram} = request.body;

        let skillSet:string[] = skills.toString().split(',').map((skill: string) => skill.trim());
        let profileObj:any = {
            user : requestedUser?.id,
            company : company,
            website : website,
            location : location,
            designation : designation,
            githubUsername : githubUsername,
            bio : bio,
            skills : skillSet,
            experience : [] as IExperience[],
            education : [] as IEducation[],
            social : {
                youtube : youtube,
                twitter : twitter,
                linkedin : linkedin,
                facebook : facebook,
                instagram : instagram
            }
        }
        // save to db
        let profile = await ProfileTable.findOneAndUpdate({
            user : requestedUser.id
        }, {
            $set : profileObj
        }, {new : true});
        response.status(200).json({
            msg : 'Profile is Updated Successfully',
            profile : profile
        });
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});


/*
    @usage : Get Profile of a User
    @url : http://127.0.0.1:5000/api/profiles/users/:userId
    @fields : no-fields
    @method : GET
    @access : PUBLIC
 */
profileRouter.get('/users/:userId', async (request:express.Request , response:express.Response) => {
    try {
        let {userId} = request.params;
        if(userId){
            let mongoUserId:any = mongoose.Types.ObjectId(userId);
            let profile:IProfile | null = await ProfileTable.findOne({user : mongoUserId}).populate('user', ['name' , 'avatar']);
            if(!profile){
                return response.status(500).json({
                    errors : [
                        {
                            msg : 'No Profile Found for the User'
                        }
                    ]
                });
            }
            response.status(200).json({
                profile : profile
            });
        }
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Delete a Profile , User , Post
    @url : http://127.0.0.1:5000/api/profiles/users/:userId
    @fields : no-fields
    @method : DELETE
    @access : PRIVATE
 */
profileRouter.delete('/users/:userId', verifyToken, async (request:express.Request , response:express.Response) => {
    try {
        let {userId} = request.params;
        if(userId){
            let mongoUserId:any = mongoose.Types.ObjectId(userId);

            // delete the profile
            let profile = await ProfileTable.findOne({user : mongoUserId});
            if(!profile){
                return response.status(500).json({
                    errors : [
                        {
                            msg : 'No Profile Found for the User'
                        }
                    ]
                });
            }
            await ProfileTable.findByIdAndRemove(profile._id);

            // delete user
            let user = await UserTable.findById(mongoUserId);
            if(!user){
                return response.status(500).json({
                    errors : [
                        {
                            msg : 'No User Found'
                        }
                    ]
                });
            }
            await UserTable.findByIdAndRemove(mongoUserId);

            // delete posts
            // TODO delete posts

            response.status(200).json(
                {
                    msg : 'Account is Deleted'
                }
            );
        }
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Update an experience of a Profile
    @url : http://127.0.0.1:5000/api/profiles/experience
    @fields : title , company , location , from , to , current , description
    @method : PUT
    @access : PRIVATE
 */
profileRouter.put('/experience',[
    body('title').not().isEmpty().withMessage('Title is Required'),
    body('company').not().isEmpty().withMessage('Company is Required'),
    body('location').not().isEmpty().withMessage('Location is Required'),
    body('from').not().isEmpty().withMessage('From Date is Required'),
    body('description').not().isEmpty().withMessage('Description is Required'),
] , verifyToken,  async (request:express.Request, response:express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        let {title , company , location , from , to , current , description} = request.body;
        let requestedUser :any = request.headers['user'];
        let profile:IProfile | null = await ProfileTable.findOne({user : requestedUser.id}).populate('user', ['name' , 'avatar']);
        if(!profile){
            return response.status(500).json({
                errors : [
                    {
                        msg : 'No Profile Found for the User'
                    }
                ]
            });
        }
        // update the profile
        let newExperience:IExperience = {
            title : title,
            company : company,
            location : location,
            from : from,
            to : to ? to : ' ',
            current : current ? current : false,
            description : description
        };
        profile.experience.unshift(newExperience);
        profile = await profile.save();
        response.status(200).json(
            {
                msg : 'Experience is Added Successfully',
                profile : profile
            }
        );
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Delete an experience of a Profile
    @url : http://127.0.0.1:5000/api/profiles/experience/:experienceId
    @fields : no-fields
    @method : DELETE
    @access : PRIVATE
 */
profileRouter.delete('/experience/:experienceId', verifyToken, async (request : express.Request, response : express.Response) => {
    try {
        let {experienceId} = request.params;
        let mongoExpId:any = mongoose.Types.ObjectId(experienceId);
        let requestedUser :any = request.headers['user'];

        let profile:IProfile | null = await ProfileTable.findOne({user : requestedUser.id}).populate('user', ['name' , 'avatar']);
        if(!profile){
            return response.status(500).json({
                errors : [
                    {
                        msg : 'No Profile Found for the User'
                    }
                ]
            });
        }
        let removableIndex = profile.experience.map(exp => exp._id).indexOf(mongoExpId);
        if(removableIndex !== -1){
            profile.experience.splice(removableIndex, 1); // remove an elem from array
            profile = await profile.save(); // save to db
            response.status(200).json(
                {
                    msg : 'Experience is Deleted Successfully',
                    profile : profile
                }
            );
        }
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Update an education of a Profile
    @url : http://127.0.0.1:5000/api/profiles/education
    @fields : school, degree, fieldOfStudy , from , to , current , description
    @method : PUT
    @access : PRIVATE
 */
profileRouter.put('/education',[
    body('school').not().isEmpty().withMessage('School is Required'),
    body('degree').not().isEmpty().withMessage('Degree is Required'),
    body('fieldOfStudy').not().isEmpty().withMessage('FieldOfStudy is Required'),
    body('from').not().isEmpty().withMessage('From Date is Required'),
    body('description').not().isEmpty().withMessage('Description is Required'),
] , verifyToken,  async (request:express.Request, response:express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        let {school , degree , fieldOfStudy , from , to , current , description} = request.body;
        let requestedUser :any = request.headers['user'];
        let profile:IProfile | null = await ProfileTable.findOne({user : requestedUser.id}).populate('user', ['name' , 'avatar']);
        if(!profile){
            return response.status(500).json({
                errors : [
                    {
                        msg : 'No Profile Found for the User'
                    }
                ]
            });
        }
        // update the profile
        let newEducation:IEducation = {
            school : school,
            degree : degree,
            fieldOfStudy : fieldOfStudy,
            from : from,
            to : to ? to : ' ',
            current : current ? current : false,
            description : description
        };
        profile.education.unshift(newEducation);
        profile = await profile.save();
        response.status(200).json(
            {
                msg : 'Education is Added Successfully',
                profile : profile
            }
        );
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Delete an education of a Profile
    @url : http://127.0.0.1:5000/api/profiles/education/:educationId
    @fields : no-fields
    @method : DELETE
    @access : PRIVATE
 */
profileRouter.delete('/education/:educationId', verifyToken, async (request : express.Request, response : express.Response) => {
    try {
        let {educationId} = request.params;
        let mongoEduId:any = mongoose.Types.ObjectId(educationId);
        let requestedUser :any = request.headers['user'];

        let profile:IProfile | null = await ProfileTable.findOne({user : requestedUser.id}).populate('user', ['name' , 'avatar']);
        if(!profile){
            return response.status(500).json({
                errors : [
                    {
                        msg : 'No Profile Found for the User'
                    }
                ]
            });
        }
        let removableIndex = profile.education.map(exp => exp._id).indexOf(mongoEduId);
        if(removableIndex !== -1){
            profile.education.splice(removableIndex, 1); // remove an elem from array
            profile = await profile.save(); // save to db
            response.status(200).json(
                {
                    msg : 'Education is Deleted Successfully',
                    profile : profile
                }
            );
        }
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Get all Profile
    @url : http://127.0.0.1:5000/api/profiles/all
    @fields : no-fields
    @method : GET
    @access : PUBLIC
 */
profileRouter.get('/all', async (request:express.Request , response:express.Response) => {
    try {
        let profiles:IProfile[] | null = await ProfileTable.find().populate('user' , ['name' , 'avatar']);
        if(!profiles){
            return response.status(500).json({
                errors : [
                    {
                        msg : 'No Profiles Found'
                    }
                ]
            });
        }
        response.status(200).json({
            profiles : profiles
        });
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

/*
    @usage : Get Profile of a User with Profile Id
    @url : http://127.0.0.1:5000/api/profiles/:profileId
    @fields : no-fields
    @method : GET
    @access : PUBLIC
 */
profileRouter.get('/:profileId', async (request:express.Request , response:express.Response) => {
    try {
        let {profileId} = request.params;
        if(profileId){
            let mongoProfileId:any = mongoose.Types.ObjectId(profileId);
            let profile:IProfile | null = await ProfileTable.findById(mongoProfileId).populate('user', ['name' , 'avatar']);
            if(!profile){
                return response.status(500).json({
                    errors : [
                        {
                            msg : 'No Profile Found for the User'
                        }
                    ]
                });
            }
            response.status(200).json({
                profile : profile
            });
        }
    }
    catch (error) {
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        });
    }
});

export default profileRouter;
