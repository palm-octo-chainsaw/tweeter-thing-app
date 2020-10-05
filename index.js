const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db = require('./config/config').get(process.env.NODE_ENV)
const loginRoute = require('./routes/login')

const app = express()

//Setup
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())

//Import routs
app.use('/api', loginRoute)

//Connecting to database
mongoose.Promise = global.Promise
mongoose.connect(db.DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}, (err) =>{
    (err) ? console.log(err) : console.log('Connected to database');
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(PORT)
})