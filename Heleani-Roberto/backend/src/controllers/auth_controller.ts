//imports
import e, { Request, Response } from "express";
import {db} from '../db/connection';

//db tables
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";

//
import {generate_token} from '../utils/jwt';
import {compare_paswords, hash_password} from '../utils/passwords';
//
import {eq} from 'drizzle-orm';
import { images } from "../db/schema/images";

//register function

/*
    1.extract user data
    2.hash the password
    3.Define regular rol for all users
    4.Define user icon img
    5.Insert new user
    6.generete token
    7.return success response with token
*/

export const register = async (req:Request, res:Response) => {
    //1.
    const {name, password, email} = req.body;
    //2.
    const hashed_password = await hash_password(password);
    //3.
    const roles = await db.select().from(user_roles);

    const role_id = roles.find(r => r.name === "Regular")?.id ?? roles[0].id;

    //4.
    const all_images = await db.select().from(images);

    const image_id = await all_images.find(i => i.name === "User")?.id ?? all_images[0].id;

    //5
        const [new_user] = await db.insert(users).values({
            name,
            email,
            password: hashed_password,
            role_id,
            image_id
            
        }).returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role_id: users.role_id,
            image_id: users.image_id
        }
        );


    //6
    const token = await generate_token({
        id:new_user.id,
        email:new_user.email,
        name: new_user.name
    });

    //7
    return res.status(201).json({message: 'User registered', token});
}

//login function
/*

    1. extract user data
    2. find user in db by email
    3. verify user exists
    4. compare provided password with stored hash
    5.generate authentication token
    6. return success response with user data and token


*/

export const login = async (req:Request, res:Response) =>{
    //1.
    const {email, password} = req.body;

    //2.

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    //3

    if (!user){
        return res.status(401).json({message: 'invalid credentials'});
    }

    //4.

    const is_password_valid= await compare_paswords (password, user.password);
    if(!is_password_valid){
        return res.status(401).json({message: 'invalid credentials'});
    }

    //5.

    const token  = await generate_token({
        id: user.id,
        name: user.name,
        email: user.email
    });

    //6

    return res.status(201).json({
        
        message: 'Login succesful',
        user: {
            id:user.id,
            email:user.email,
            username:user.name
        },

        token

    });
}