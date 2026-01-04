const mongoose = require('mongoose');


const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/todoDb";

const db = async (req,res) => {
    try {
        await mongoose.connect(DB_URI);
        console.log('To-do server connected to database');
    } catch (error) {
        console.error("Error connecting to database",error);
        process.exit(1);
    }
    
}

module.exports = db;
