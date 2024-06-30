import mongoose from "mongoose";
import {config} from 'dotenv';

async function connect(){

    try {
        config();
        // const mongoString = process.env.DATABASE_URL;
        const mongoString = "mongodb+srv://girishgaikwad2055:9842123@chatapp.yo3eo5w.mongodb.net/chatapp";
        const database = await mongoose.connect(mongoString);
        console.log('Database Connected');
        return database;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error; // Rethrow the error to be caught in the calling function
    }
}

export default connect;



