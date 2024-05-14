const PORT = process.env.PORT || 3001
const DATABASE_HOST = 'natural-choir-423219-k8:us-central1:true-mates-db'
const DB_NAME = 'truemates'
const DB_URL = "postgres://postgres:postgres@34.27.105.152:5432/truemates";

module.exports = {
    PORT,
    DATABASE_HOST,
    DB_NAME,
    DB_URL
}