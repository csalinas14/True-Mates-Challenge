require('dotenv').config()

const PORT = process.env.PORT || 3001

const DB_URL = process.env.DB_URL;

module.exports = {
    PORT,
 
    DB_URL
}