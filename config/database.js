import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.DATABASE;

const connectDatabase = () => {
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Database connected.")
    });
}

export default connectDatabase;