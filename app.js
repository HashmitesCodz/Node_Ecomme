const express = require('express');
require("dotenv").config();
const mogoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const authRoutes = require('./router/auth');
const userRoutes = require('./router/user');
const categoryRoutes = require('./router/category');
const productRoutes = require('./router/product');
const braintreeRoutes = require('./router/braintree');
const orderRoutes = require('./router/order');
const expressValidator = require('express-validator');
const cors = require("cors");


// app
const app = express();

// db
mogoose.connect(process.env.DATABASE, 
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{console.log("DB CONNECTED")});

// Middlewares

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes)

const port  = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`server is running at port ${port}`);
});
