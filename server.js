const express = require('express');
const app = express();
const connectDB= require('./config/db')

connectDB();

PORT = 4000 || env.production

app.use('/api/regiser',require('./routes/Register'));
app.use('/api/articles',require('./routes/articles'));
//app.use('/api/auth',auth);
app.listen(PORT,()=> console.log(`server runining ${PORT}`) )
