import {Context, Next} from "koa";
import jwt from 'jsonwebtoken'
import {jwtsecret} from "./generateAccessToken";

async function verifyJsonWebToken(ctx:Context, next:Next){
    try {
        let token;
        if(ctx.request.headers['authorization']){
            token = ctx.request.headers['authorization']
            ctx.state.user = jwt.verify(token, jwtsecret);
            return next();
        }
    } catch (err) {
        if(err.name === 'TokenExpiredError'){
            ctx.status = 500;
            ctx.body = {
                error: 'jwt expired'
            }
            await next();
        }else {
            ctx.status = 401;
            ctx.body = {
                error: 'Uknown user'
            }
            await next();
        }
    }
}

module.exports = {
    verifyJsonWebToken
}
