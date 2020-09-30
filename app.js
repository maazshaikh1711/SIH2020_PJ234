const fs = require('fs');
const express = require('express');
const morgan = require('morgan');       //optional.. gives detail when request is made

const AppError = require('./src/utils/appError')
const globalErrorHandler = require('./src/controllers/errorController')

const userRoute = require('./src/routes/userRoutes')
// const towerRoute = require('./routes/towerRoutes')
const recommendationRoute = require('./src/routes/recommendationRoute')
const mobileUserRoute = require('./src/routes/mobileUserRoute')
const complaintRoute = require('./src/routes/complaintRoute')
const remoteNetworkRoute = require('./src/routes/remoteNetworkRoute')

const app = express();

//just to check whether it is in development or not
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

{
    /*     Creating our own middleware

    app.use( (req,res,next)=> {
        ... 
        ...

        next();         //nvr forget to use next... if we dont use it, request-response cycle will get stucked forever
    }
*/
}


// app.get('/', (req, res) => {
//     res.status(200).json({ "message": 'Hello from the server', "app": 'natours' });
// });

// '/' urls
// (req, res) is called route handler

// app.post('/', (req, res) => {
//     res.send('heyy u can post here');
// })



/////////////////////       REST       //////////////////////

// resource should nvr contain verbs... verbs must b in html requets... 
// ex: tours is the resource,  GET method for accesing the resource, POST method for creating and so on....  
//CRUD

// 1) TO Read
// GET: performs read operation only

// 2) To Write
// POST: performs creation: can give and set the data

// 3) To Update

// i) PUT: whole object is to be provided
// ii) PATCH: when only a piece of info is to be updated


// 4) To Delete
// DELETE: to delete the resource 

////////STATUS CODE/////////

//if everything's fine      =>      200
//if action is forbidden    =>      403
//if it is not found        =>      404
//if file is created        =>      201 
//if file is deleted        =>      204
//internal server error     =>      500



// 1) MIDDLEWARES           //sequence of writing middlewares matters a lot so be careful 

//app.use(morgan('dev'))      //optional (just used to show logger)

app.use(express.json())
//used for post method.. if not used , would give undefined

//to use static file
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
    console.log("Hello from the middleware 👀")
    // console.log(req.headers)
    next();
})

{
    /*  ////////////// USE THIS SET OF METHODS OR CAN MERGE INTO ONE WHICH REQUIRES SAME URL , AS WRITTEN AFTER THIS COMMENT SECTION //////////////  

//Handling get requests     //READ FROM CRUD
app.get('/api/v1/tours', getTours)


//handling parameters       // also a part of READ
// : varname  , accepts as parameters and is compulsory to give,  if we want to keep it as optional give preceeding ?   example:  tours/:id?
app.get('/api/v1/tours/:id', getTour)


//handling patch requests       //UPDATE FROM CRUD
app.patch('/api/v1/tours/:id', updateTour)


//handling post requests        //CREATE from CRUD
app.post('/api/v1/tours', createTour)


//handling delete requests      //DELETE from CRUD
app.delete('/api/v1/tours/:id', deleteTour)

*/ }

//2) ROUTE HANDLERS


// 3) ROUTES


app.use('/api/v1/users', userRoute)
// app.use('/api/v1/towers', towerRoute)
app.use('/api/v1/recommendation', recommendationRoute)
app.use('/api/v1/mobileusers', mobileUserRoute)
app.use('/api/v1/complaints', complaintRoute)
app.use('/api/v1/remotenetwork', remoteNetworkRoute)

//since middleware strictly goes with the sequence...that means the execution will reach here only if it didnt got returned by any of the code above

app.use('/', (req, res, next)=>{
    res.send("Perfect!")  
});

app.all('*', (req, res, next) => {

    next(new AppError(`Cant find ${req.originalUrl} on this erver !!!`, 404))       //req.originalUrl is a special var......
})

app.use(globalErrorHandler)

module.exports = app

// 4) START SERVER

