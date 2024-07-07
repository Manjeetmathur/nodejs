const express = require('express');
const app = express();
const db = require("./db");

const bodyParser = require("body-parser");
app.use(bodyParser.json());


const personRoutes = require('./routes/personRoutes')
app.use('/person',personRoutes);

const menuRoutes = require('./routes/menuRotues')
app.use('/Menu',menuRoutes);

app.listen(3000);
