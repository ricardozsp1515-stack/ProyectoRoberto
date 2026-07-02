import seed_user_roles from "./seed_user_roles";
import seed_users from "./seed_users";
import seed_pet_types from "./seed_pet_types";
import seed_images from "./seed_images";
import seed_admin from "./seed_admin";

const seeders = async () => {
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
        console.log("Starting seeders...");

        //first executte roles seed
        //await seed_user_roles();

        //admins seed
        await seed_admin();

        //users seed
        //await seed_users();

        //pet_types seed
        //await seed_pet_types();   

        //images_seed
        //await seed_images();

        console.log('Seeders completed successfully!');
    
}catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }
}

if(require.main === module){
    seeders().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}

export default seeders;