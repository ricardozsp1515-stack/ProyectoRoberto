import db from "../connection";
import { pet_types } from "../schema/pet_types";

const seed_pet_types = async () => {
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
        await db.delete(pet_types).execute();
        console.log('inserting seed data...');
        
        // Insert seed data
        // Insert pet_types (no ID needed)
        const insert_pet_types = await db.insert(pet_types).values([

            //
            {name: "Dog"},
            //
            {name: "Cat"},
            //
            {name: "Freshwater fish"},
            //
            {name: "Budgie or Canarie"},
            //
            {name: "Hamster"},
            //
            {name: "Rabbit"},
            //
            {name: "Guinea pig"},
            //
            {name: "Water turtle"},
            //
            {name: "Ferret"},
            //
            {name: "Gecko (small lizard)"},
            //
            {name: "Parrot or Cockatoo"},
            //
            {name: "Saltwater fish"},
            //
            {name: "Snake"},
            //
            {name: "Chinchilla"},
            //
            {name: "Pet rat"},
            //
            {name: "Gerbil"},
            //
            {name: "Hedgehog"},
            //
            {name: "Frogs (amphibians)"},
            //
            {name: "Tarantulas or Scorpions"},
            //
            {name: "Pot-bellied pigs"},
            //
            {name: "Other"},

        ]).returning();
        

        console.log('seed_pet_types completed successfully!');

    }catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }

    if(require.main === module){
    seed_pet_types().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}
}

export default seed_pet_types;