import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotEnv from 'dotenv';
import userRouter from "./router/userRouter";
import profileRouter from "./router/ProfileRouter";
import postRouter from "./router/postRouter";

const app:express.Application = express();

// configure dotEnv
dotEnv.config({
    path : './.env'
})

const port : number = Number(process.env.PORT) || 5000;

// configure cors
app.use(cors());

// configure to receive form data
app.use(express.json());

// connect to MongoDB
let dbURL : string | undefined = process.env.MONGO_DB_CLOUD;
if(dbURL){
    mongoose.connect(dbURL, {
        useCreateIndex : true,
        useFindAndModify : false,
        useNewUrlParser : true,
        useUnifiedTopology : true
    }).then((response) => {
        console.log(`Connected to MongoDB Successfully....`);
    }).catch((error) => {
        console.error(error);
        process.exit(1); // stops node js process
    });
}

app.get('/', (request:express.Request , response:express.Response) => {
    response.status(200).send(`<h2>Welcome to React Social Server App</h2>`);
});

// configure the routers
app.use('/api/users', userRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/posts', postRouter);

if(port) {
    app.listen(port, () => {
        console.log(`Express Server is Started at http://127.0.0.1:${port}`);
    });
}
