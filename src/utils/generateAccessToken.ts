import jwt from 'jsonwebtoken';

export const jwtsecret = "mysecretkey";

export function generateAccessToken(user: any) {
    return jwt.sign(user, jwtsecret, {expiresIn: '24h'})
}
