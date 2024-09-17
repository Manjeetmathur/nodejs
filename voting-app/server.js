const express = require('express');
const app = express();
const db = require('./db')
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;



const userRoutes = require('./routes/userRoutes');
app.use('/user',userRoutes);
const candidateRoutes = require('./routes/candidateRoute');
app.use('/candidate',candidateRoutes);

app.listen(PORT , () => {
       console.log("listning on port 3000");
})