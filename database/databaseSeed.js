require('dotenv').config();
var mongoose = require('mongoose');

const userSeeder = require('./userSeeder');

exports.seed = async () => {
    console.log('Database seeding...'); 
    mongoose.connect(process.env.DATABASE);  

    await userSeeder.seed();
    
    mongoose.connection.close();   
    console.log('Seeding complete');
}