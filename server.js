const mongoose = require('mongoose')
const dotenv = require('dotenv');


//this exception occurs when we try to access a var which is not yet defined... so it starts to listen from here and till the end of code
process.on('uncaughtException', err => {
    console.log(err.name, err.message)
    console.log("Unhandled Rejection !!..  SHUTTING DOWN !!!")
    process.exit(1)         //exits.. 0 as okay.. 1 as uncalled exception
})


//loads environment variables from a .env file into process.env
dotenv.config({ path: './config.env' })
const app = require('./app')

//connection string of ATLAS DB
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// const DB = process.env.DATABASE_LOCAL        //connection string of Local DB


//connecting db
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() =>
    //console.log(con.connections); 
    console.log('DB Connection successful'))

//in above code...if we want to connect to a local db then, replace DB with process.env.DATABASE_LOCAL


//console.log(app.get('env'))
//console.log(process.env)

const port = process.env.PORT || 5000

const server = app.listen(port, () => {
    console.log(`App running on the port ${port}`)
})


process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log("Unhandled Rejection !!..  SHUTTING DOWN !!!")
    server.close(() => {
        process.exit(1)         //exits.. 0 as okay.. 1 as uncalled exception
    });
})


