import db from "../connection";
import { users } from "../schema/users";
import { user_roles } from "../schema/user_roles";
import { images } from "../schema/images";
import {hash_password} from '../../utils/passwords';

const seed_admin = async () => {
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

    const admin_role = roles.find(r => r.name === "admin")?.id ?? roles[0].id;

    // Buscamos la imagen por nombre en vez de un UUID fijo, porque
    // seed_images genera IDs aleatorios (defaultRandom) en cada corrida
    const all_images = await db.select().from(images);

    const default_image_id = all_images.find(i => i.name === "User")?.id ?? all_images[0].id;

    const password_1 = await hash_password("ricardoadmin007");

    const password_2= await hash_password("fiorellaadmin007");

    try{

        console.log('inserting seed data...');
        
        // Insert seed data
        // Insert users (no ID needed)
        const insert_admins = await db.insert(users).values([
            {
                name: "Ricardo",
                email: "ricardo@heleani.com",
                password: password_1,
                role_id: admin_role,
                image_id: default_image_id
            },
            {
                name: "Fiorella",
                email: "fiorella@heleani.com",
                password: password_2,
                role_id: admin_role,
                image_id: default_image_id
            }
        ]).returning();
        

        console.log('seed_admin completed successfully!');

    }catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }

    if(require.main === module){
    seed_admin().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}
}

export default seed_admin;