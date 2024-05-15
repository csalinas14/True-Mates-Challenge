const Sequelize = require('sequelize')
const {  DB_URL } = require("./config")
const { Umzug, SequelizeStorage } = require('umzug')


const sequelize = new Sequelize('truemates', 'tester', 'carlostruemates', {
    dialect: 'postgres',
    host: DB_URL,
})
//const sequelize = new Sequelize(DB_URL)

const migrationConf = {
    migrations: {
        glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations'}),
    context: sequelize.getQueryInterface(),
    logger: console,
}

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf)
    const migrations = await migrator.up()
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name)
    })
}

const connectToDatabase = async () => {
    try{
        await sequelize.authenticate()
        await runMigrations()
        console.log('connected to database')
    } catch(err){
        console.error(err)
        return process.exit(1)
    }
    return null
}

module.exports = {connectToDatabase, sequelize}