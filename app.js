const express = require('express');
const ExpressError = require('./expressError');
const morgan = require('morgan')

const itemRoutes = require('./routes/items')

const app = express();
app.use(express.json());
app.use(morgan('dev'))

app.use('/items', itemRoutes)


app.use(function(err, req, res, next){
    let status = err.status || 500;
    return res.status(status).json({
        error:{
            message:err.message,
            status:status
        }
    });
})

module.exports = app;