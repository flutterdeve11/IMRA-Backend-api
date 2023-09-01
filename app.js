const express = require('express');
require('dotenv').config();
require('./models/db');
const useRouter= require('./routes/user');
const User =  require('./models/user');

const app = express();

app.use(express.json());
app.use(useRouter);
const PORT = process.env.PORT;
app.get('/',(req, res)=>{
res.send('<h1>Hello world<h1>');
});

app.listen(PORT,()=>{
    console.log(`Server is conncet to part number ${PORT}`)
})

//// mongodb+srv://azam:azam123@imradatabase.lu0ke6f.mongodb.net/imradatabase?retryWrites=true&w=majority