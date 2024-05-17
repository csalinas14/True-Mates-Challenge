require('dotenv').config()

const PORT = process.env.PORT || 3001

const DB_URL = process.env.DB_URL;

const SECRET = process.env.SECRET

module.exports = {
    PORT,
    SECRET,
    DB_URL
}
