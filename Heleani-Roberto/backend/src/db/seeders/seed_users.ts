import db from "../connection";
import { users } from "../schema/users";
import { user_roles } from "../schema/user_roles";

const seed_users = async () => {
    // PROTECTION: Prevent seeding in production
    const appStage = process.env.APP_STAGE;
    
    if (appStage === 'production') {
        console.error('ERROR: Cannot run seed script in production environment!');
        console.error('Current APP_STAGE:', appStage);
        process.exit(1); // Exit with error code
    }

    // confirmation for staging/test environments
    console.log(`Running seed in ${appStage} environment...`);
    console.log('starting seed...');

    const roles = await db.select().from(user_roles);

    const default_role = roles.find(r => r.name === "Regular")?.id ?? roles[0].id;

    try{

        console.log('deleting existing data...');
        await db.delete(users).execute();
        console.log('inserting seed data...');
        
        // Insert seed data
        // Insert users (no ID needed)
        const insert_users = await db.insert(users).values([
            {
                name: "Ricardo",
                email: "ricardo@gmail.com",
                password: "123456",
                role_id: default_role,
            },
            {
                name: "Valeria",
                email: "vale@gmail.com",
                password: "contrasena",
                role_id:default_role
            }
        ]).returning();
        

        console.log('seed_users completed successfully!');

    }catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }

    if(require.main === module){
    seed_users().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}
}

export default seed_users;