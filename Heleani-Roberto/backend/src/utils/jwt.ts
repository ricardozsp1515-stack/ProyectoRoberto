/*
    SingJWT creates abd sings new tokens
    jwtVerify verifies and decodeds tokens
    Payload TS type for JWT payload
*/
import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayloda } from 'jose';
import { createSecretKey } from 'crypto';
import env from '../../env';

// interface to add user-specific fields

export interface CustomJWTPayload extends JoseJWTPayloda {
    id: string,
    email: string,
    name: string
}

//generate token function

/*
    1. takes uesr data
    2. gets secret key form env config
    3. creates jwt:
        a.user data
        b. algorithm dor signing
        c. timestamp whe created
        d. expiration time

    4. signs token with secret key
    5. returns the complete token
*/

export const generate_token = async (payload: CustomJWTPayload) => {

    /*  1.get the secret key form env variable and is used to sign the token
        (like a digital signature)
        2. Convert the secret string into a proper cryptographic key, the method
        creates a key object for signing JWTs
    */
    const secret_key = createSecretKey(env.JWT_SECRET, 'utf-8');
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(env.JWT_EXPIRES_IN)
        .sign(secret_key)

    return token;
}

