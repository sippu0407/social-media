import express, {raw} from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = async (request:express.Request , response:express.Response , next: express.NextFunction) => {
    try {
        let token:any = request.headers['x-auth-token'];
        if(!token){
            return response.status(401).json({
                errors : [
                    {msg : 'No Token provided, Authentication Denied'}
                ]
            });
        }
        let secretKey: string | undefined = process.env.JWT_SECRET_KEY;
        if(secretKey){
            let decode:any = await jwt.verify(token, secretKey);
            request.headers['user'] = decode.user;
            next();
        }
    }
    catch (error) {
        return response.status(500).json({
            errors : [
                {msg : 'Invalid Token, Authentication Denied'}
            ]
        });
    }
};
export default verifyToken;