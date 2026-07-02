import db from "../connection";
import { user_roles } from "../schema/user_roles";

const seed_user_roles = async () => {
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

    try{

        console.log('deleting existing data...');
        await db.delete(user_roles).execute();
        console.log('inserting seed data...');
        
        // Insert seed data
        // Insert roles (no ID needed)
        const insert_users = await db.insert(user_roles).values([
            {name: "Regular",},

            {name: "Veterinarian",},

            {name: "admin"}

        ]).returning();
        

        console.log('seed_user_roles completed successfully!');

    }catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }

    if(require.main === module){
    seed_user_roles().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}
}

export default seed_user_roles;