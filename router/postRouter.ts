import express from 'express';
import verifyToken from "../middlewares/TokenVerifier";
import UserTable from "../models/UserTable";
import PostTable from "../models/PostTable";
import mongoose from 'mongoose';
import {body, validationResult} from 'express-validator';
import {IUser} from "../models/IUser";
import {IPost} from "../models/IPost";

const postRouter:express.Router = express.Router();

/*
    @usage : Create a Post
    @url : http://127.0.0.1:5000/api/posts/
    @fields : image , text
    @method : POST
    @access : PRIVATE
 */
postRouter.post('/',[
    body('image').not().isEmpty().withMessage('Image Url is Required'),
    body('text').not().isEmpty().withMessage('Text is Required'),
] ,verifyToken, async (request : express.Request, response : express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        let {image , text} = request.body;
        let requestedUser :any = request.headers['user'];
        let user:IUser | null = await UserTable.findById(requestedUser.id);
        if(user){
            let newPost = {
                user : requestedUser.id,
                text : text,
                image : image,
                name : user.name,
                avatar : user.avatar
            };
            //create a post
            let post = new PostTable({...newPost});
            post = await post.save();
            response.status(200).json(
                {
                    msg : 'Post is Created Successfully',
                    post : post
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
    @usage : Get All the posts
    @url : http://127.0.0.1:5000/api/posts/
    @fields : no-fields
    @method : GET
    @access : PRIVATE
 */
postRouter.get('/', verifyToken, async (request:express.Request, response : express.Response) => {
    try {
        let posts:IPost[] = await PostTable.find();
        if(!posts){
            return response.status(400).json({
                errors : [
                    {
                        msg : 'No Posts Found'
                    }
                ]
            });
        }
        response.status(200).json(
            {
                posts : posts
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
    @usage : Get a post with Post Id
    @url : http://127.0.0.1:5000/api/posts/:postId
    @fields : no-fields
    @method : GET
    @access : PRIVATE
 */
postRouter.get('/:postId', verifyToken, async (request:express.Request, response : express.Response) => {
    try {
        let {postId} = request.params;
        let mongoPostId:any = mongoose.Types.ObjectId(postId);
        if(mongoPostId){
            let post:IPost | null = await PostTable.findById(mongoPostId);
            if(!post){
                return response.status(400).json({
                    errors : [
                        {
                            msg : 'No Posts Found for the Post ID'
                        }
                    ]
                });
            }
            response.status(200).json(
                {
                    post : post
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
    @usage : Delete a post with Post Id
    @url : http://127.0.0.1:5000/api/posts/:postId
    @fields : no-fields
    @method : DELETE
    @access : PRIVATE
 */
postRouter.delete('/:postId', verifyToken, async (request:express.Request, response : express.Response) => {
    try {
        let {postId} = request.params;
        let mongoPostId:any = mongoose.Types.ObjectId(postId);
        if(mongoPostId){
            let post:IPost | null = await PostTable.findById(mongoPostId);
            if(!post){
                return response.status(400).json({
                    errors : [
                        {
                            msg : 'No Posts Found for the Post ID'
                        }
                    ]
                });
            }
            // delete the post
            post = await PostTable.findByIdAndRemove(mongoPostId);
            response.status(200).json(
                {
                    msg : 'Post Deleted Successfully',
                    post : post
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
    @usage : Like A Post with PostId
    @url : http://127.0.0.1:5000/api/posts/like/:postId
    @fields : no-fields
    @method : PUT
    @access : PRIVATE
 */
postRouter.put('/like/:postId', verifyToken, async (request : express.Request, response:express.Response) => {
    try {
        let {postId} = request.params;
        let mongoPostId:any = mongoose.Types.ObjectId(postId);
        let requestedUser :any = request.headers['user'];
        if(mongoPostId) {
            let post: IPost | null = await PostTable.findById(mongoPostId);
            // check if the post exists
            if (!post) {
                return response.status(400).json({
                    errors: [
                        {
                            msg: 'No Posts Found for the Post ID'
                        }
                    ]
                });
            }
            // check if the user has already been liked
            if(post.likes.filter(like => like.user.toString() === requestedUser.id.toString()).length > 0){
                return response.status(400).json({
                    errors : [
                            {
                                msg : 'Post has already been liked'
                            }
                        ]
                });
            }
            // like the post
            post.likes.unshift({user: requestedUser.id});
            await post.save(); // save to db
            response.status(200).json({
                post : post
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
    @usage : Un-Like A Post with PostId
    @url : http://127.0.0.1:5000/api/posts/unlike/:postId
    @fields : no-fields
    @method : PUT
    @access : PRIVATE
 */
postRouter.put('/unlike/:postId', verifyToken, async (request : express.Request, response:express.Response) => {
    try {
        let {postId} = request.params;
        let mongoPostId:any = mongoose.Types.ObjectId(postId);
        let requestedUser :any = request.headers['user'];
        if(mongoPostId) {
            let post: IPost | null = await PostTable.findById(mongoPostId);
            // check if the post exists
            if (!post) {
                return response.status(400).json({
                    errors: [
                        {
                            msg: 'No Posts Found for the Post ID'
                        }
                    ]
                });
            }
            // check if the user has already been liked
            if(post.likes.filter(like => like.user.toString() === requestedUser.id.toString()).length === 0){
                return response.status(400).json({
                    errors : [
                        {
                            msg : 'Post has not been liked'
                        }
                    ]
                });
            }
            // unlike the post
            let removableIndex = post.likes.map(like => like.user.toString()).indexOf(requestedUser.id.toString());
            if(removableIndex !== -1){
                post.likes.splice(removableIndex , 1);
                await post.save(); // save to db
                response.status(200).json({
                    post : post
                });
            }
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
    @usage : Create Comment to a post
    @url : http://127.0.0.1:5000/api/posts/comment/:postId
    @fields : text
    @method : POSt
    @access : PRIVATE
 */
postRouter.post('/comment/:postId',[
    body('text').not().isEmpty().withMessage('Text is Required'),
], verifyToken, async (request : express.Request, response : express.Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        let {text} = request.body;
        let {postId} = request.params;
        let mongoPostId:any = mongoose.Types.ObjectId(postId);
        let requestedUser :any = request.headers['user'];
        let user:IUser | null = await UserTable.findById(requestedUser.id);
        if(mongoPostId && user) {
            let post: IPost | null = await PostTable.findById(mongoPostId);
            // check if the post exists
            if (!post) {
                return response.status(400).json({
                    errors: [
                        {
                            msg: 'No Posts Found for the Post ID'
                        }
                    ]
                });
            }
            // comment
            let newComment = {
                user : requestedUser.id,
                text : text,
                name : user.name,
                avatar: user.avatar,
                date : new Date().toLocaleDateString()
            };
            post.comments.unshift(newComment);
            post = await post.save(); // save to db
            response.status(200).json({
                msg : 'Comment is Created Successfully',
                post : post
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
    @usage : DELETE Comment of a post
    @url : http://127.0.0.1:5000/api/posts/comment/:postId/:commentId
    @fields : no-fields
    @method : DELETE
    @access : PRIVATE
 */
postRouter.delete('/comment/:postId/:commentId', verifyToken, async (request :express.Request, response:express.Response) => {
    try {
        let {postId , commentId} = request.params;
        let mongoPostID = mongoose.Types.ObjectId(postId);
        let mongoCommentID = mongoose.Types.ObjectId(commentId);
        let requestedUser :any = request.headers['user'];
        let post:IPost | null = await PostTable.findById(mongoPostID);
        if(post){
            // pull the comments of a post
            let comment = post.comments.find(comment => {
                if(comment._id){
                    return comment._id.toString() === commentId.toString()
                }
            });
            // make sure the comment exists
            if(!comment){
                return response.status(404).json({
                    errors : [
                        {
                            msg : 'Comment not exists'
                        }
                    ]
                })
            }
            // check user, is he only made the comment
            if(comment.user.toString() !== requestedUser.id){
                return response.status(401).json({
                    errors : [
                        {
                            msg : 'User is not authorized'
                        }
                    ]
                });
            }
            // get remove index
            let removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(requestedUser.id);
            if(removeIndex !== -1){
                post.comments.splice(removeIndex, 1);
                await post.save();
                response.status(200).json({
                    msg : 'Comment is Deleted',
                    post : post
                });
            }
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

export default postRouter;
