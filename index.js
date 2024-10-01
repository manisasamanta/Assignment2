const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./app/config/dbcon')
const dotenv = require('dotenv')


dotenv.config()
connectDB()
const app = express();

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'public')))
app.use("/uploads",express.static(path.join(__dirname,'uploads')))

//router
const userRouter = require('././app/router/apiRouter')
app.use('/api',userRouter)



const port = 3600
app.listen(port,()=>{
    console.log(`surver running at http://localhost:${port}`);
})