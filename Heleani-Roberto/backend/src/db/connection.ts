import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import { users, user_roles, pets, pet_types, veterinarian, veterinary_center, images, comments, appointment } from "./schema/index_schema";
import env from "../../env";

const createPool = ()=>{
    return new Pool({
        connectionString: env.DATABASE_URL,
        connectionTimeoutMillis: 10000,
        max: 1,
        ssl: {
            rejectUnauthorized: false
        }
        //idleTimeoutMillis: 0,
        //keepAlive: true,
        //keepAliveInitialDelayMillis: 10000
    });
}

const schema = {users, user_roles, pets, pet_types, veterinarian, veterinary_center, images, comments, appointment}

export const db = drizzle(createPool(), {schema} );
export default db;