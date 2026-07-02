import bcrypt from 'bcrypt';
import env from '../../env';

/*
    converts plain test password into a secure hash
    1. takes user´s password
    2. adds a random "salt" (random data)
    3. runs bcrypt alg multiple times (based on BCRYPT_ROUNDS)
    4. returns a hash
*/

export const hash_password = async (password:string) => {
    return bcrypt.hash(password, env.BCRYPT_ROUNDS);
}


/*
    compare passwords function
    1. takes the password user just typed
    2. takes the hashed password from db
    3. bcrypt extracts the salt from stored hash
    4. hashes typed pass using the same salt
    5. compare hashes
    6. return true if match, false if dont
*/

export const compare_paswords = async (password:string, hashed_password: string) => {
    return bcrypt.compare (password, hashed_password);
}