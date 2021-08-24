import {Context, Next} from "koa";
import {Db} from "mongodb";
import jwt from 'jsonwebtoken'
import KoaRouter from 'koa-router';

import {hashPassword} from '../../utils/hashPassword'
import {withDB} from "../../database/MongoConnection";
import {User as UserType} from '../../types/UserTypes'
import User from "../../entities/User";

const {jwtsecret, generateAccessToken} = require("../../utils/generateAccessToken");

const authRouter = new KoaRouter();


authRouter.post('/login', async (context: Context, next: Next) => {
    // Authenticate User
    await withDB(async (db:Db)=>{
        try {
            const isUserExist = await db.collection('user').findOne({email: context.request.body.formData.email});
            if (!isUserExist) {
                context.body = {
                    error: 'User not found'
                }
                return;
            }

            const email: string = context.request.body.formData.email, password: string = isUserExist.password;

            const user: UserType = {email: email, password: password, _id: isUserExist._id, lastName: isUserExist.lastName, name: isUserExist.name}

            const accessToken: string = generateAccessToken(user)

            const refreshToken: string = jwt.sign(user, jwtsecret, {expiresIn: '30d'})

            context.body = {accessToken: accessToken, refreshToken: refreshToken}
            await next()
        }catch (error){
            await next()
        }

    }, context)
})

authRouter.post('/refreshToken', async (context: Context, next: Next) => {
    const decodedUser: any = jwt.decode(context.request.body.refreshToken);

    const user: UserType = {
        email: decodedUser.email,
        password: decodedUser.password,
        _id: decodedUser.id,
        lastName: decodedUser.lastName,
        name: decodedUser.name
    }

    const accessToken: string = generateAccessToken(user)

    const refreshToken: string = jwt.sign(user, jwtsecret, {expiresIn: '30d'})

    context.body = {accessToken: accessToken, refreshToken: refreshToken}

    await next()
})

authRouter.post('/signup', async (context: Context, next: Next) => {
    await withDB(async (db: Db) => {
        const isUserExist = await db.collection('user').findOne({email: context.request.body.formData.email})

        if (isUserExist) {
            context.body = {
                error: 'Email is already exist'
            }
        } else {
            const user = {
                name: context.request.body.formData.name,
                password: await hashPassword(context.request.body.formData.password, 10),
                email: context.request.body.formData.email,
                lastName: context.request.body.formData.lastName
            };

            context.body = await db.collection('user').insertOne(user)
        }
        await next()
    }, context)
})

export default authRouter;
