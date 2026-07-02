// imports
import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from "jose";

// Token decorder helper

/*
    User data will come from the token, to compiler this user may will be any and that generate problems, to solve that
    we create an interface with data that suppose the user will have
*/

export interface Authenticated_user {
    id: string;
    email: string;
}

// validate token

/* 
    To use auth token data, you need to decode data, this function do that, take the token from auth header, now use jwtVerify() to decode
    token and take id and email from that
*/

export const validate_token = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // extract token from header
        const auth_header = req.headers.authorization;

        // verify token exist
        if (!auth_header) {
            return res.status(401).json({ message: "Token not provided" });
        }

        // take only the token (exclude "bearer")
        const token = auth_header.split(" ")[1];

        // verify token signature 
        const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);

        // decode token
        const { payload } = await jwtVerify(token, secret_key);

        // you can cast payload to Authenticated user directly, for that first cast to unknown to avoid problems
        const data = payload as unknown as Authenticated_user;

        // add user as a property of req to use user data on controllers
        (req as Request & { user: Authenticated_user }).user = {
            id: data.id,
            email: data.email,
        };

        // if everything works, go to next 
        next();

        // handle errors
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// get auth user function

/*
    This function take token data and convert it into an object
*/
export const get_auth_user = async (req: Request) => {

    const auth_user = (req as Request & { user?: Authenticated_user }).user;

    if (!auth_user) {
        throw new Error("UNAUTHENTICATED");
    }

    return auth_user;
};