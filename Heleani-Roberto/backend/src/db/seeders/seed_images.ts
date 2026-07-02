import db from "../connection";
import { images } from "../schema/images";

const seed_images = async () => {
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
        await db.delete(images).execute();
        console.log('inserting seed data...');
        
        // Insert seed data
        // Insert pet_types (no ID needed)
        const insert_images = await db.insert(images).values([

            //
            {
                name: "User" ,
                url: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_150.png" 
            },
            {
                name: "Veterinarian 1" ,
                url: "https://images.pexels.com/photos/6235238/pexels-photo-6235238.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" 
            },
            {
                name: "Veterinarian 2" ,
                url: "https://images.pexels.com/photos/6234975/pexels-photo-6234975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" 
            },
            {
                name: "Veterinary center" ,
                url: "https://images.pexels.com/photos/6473188/pexels-photo-6473188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" 
            },
            {
                name: "Dog" ,
                url: "https://images.pexels.com/photos/32113856/pexels-photo-32113856.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {   
                name: "Cat",
                url: "https://images.pexels.com/photos/35224529/pexels-photo-35224529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Freshwater fish",
                url: "https://images.pexels.com/photos/35942836/pexels-photo-35942836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Budgie or Canarie", 
                url: "https://images.pexels.com/photos/6390889/pexels-photo-6390889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Hamster",
                url: "https://images.pexels.com/photos/16509406/pexels-photo-16509406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Rabbit",
                url: "https://images.pexels.com/photos/8903042/pexels-photo-8903042.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Guinea pig",
                url: "https://images.pexels.com/photos/20839549/pexels-photo-20839549.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Water turtle",
                url: "https://images.pexels.com/photos/32646056/pexels-photo-32646056.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Ferret", 
                url: "https://images.pexels.com/photos/7179718/pexels-photo-7179718.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Gecko (small lizard)", 
                url: "https://images.pexels.com/photos/29979168/pexels-photo-29979168.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Parrot or Cockatoo", 
                url: "https://images.pexels.com/photos/14413302/pexels-photo-14413302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Saltwater fish", 
                url: "https://images.pexels.com/photos/4593102/pexels-photo-4593102.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Snake", 
                url: "https://images.pexels.com/photos/4576625/pexels-photo-4576625.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Chinchilla", 
                url: "https://images.pexels.com/photos/8434701/pexels-photo-8434701.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Pet rat",
                url: "https://images.pexels.com/photos/11209119/pexels-photo-11209119.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Gerbil",
                url: "https://images.pexels.com/photos/30970832/pexels-photo-30970832.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Hedgehog",
                url: "hhttps://images.pexels.com/photos/18447656/pexels-photo-18447656.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Frogs (amphibians)",
                url: "https://images.pexels.com/photos/20831274/pexels-photo-20831274.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Tarantulas or Scorpions",
                url: "https://images.pexels.com/photos/35022900/pexels-photo-35022900.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Pot-bellied pigs",
                url: "https://images.pexels.com/photos/27061599/pexels-photo-27061599.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            },
            //
            {
                name: "Other",
                url: "https://cdn.pixabay.com/photo/2020/07/05/03/36/chameleon-5371466_150.png"
            }

        ]).returning();
        

        console.log('seed_images completed successfully!');

    }catch(error){
        console.error('Error during seeding:', error);
        process.exit(1); // Exit with error code
    }

    if(require.main === module){
    seed_images().then(() => {
        console.log('Seed script finished.');
        process.exit(0); // Exit with success code
    }).catch((error) => {
        console.error('Error running seed script:', error);
        process.exit(1); // Exit with error code
    });
}
}

export default seed_images;