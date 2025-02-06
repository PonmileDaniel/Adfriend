const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


//  MiddleWare
app.use(cors());
app.use(express.json());

//  Routes
app.use('/api', contentRoutes)




module.exports = app;