const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./src/config/db')
const todoRouter = require('./src/routes/todo.routes');

require('dotenv').config();
const port = process.env.PORT || 3004;


app.use(express.json());
app.use(morgan("dev"));
app.use('/api/todo', todoRouter);


app.get("/",(req,res) => {
    res.send("This is a TO-do App");
})

db();

app.listen(port,()=>{
    console.log(`To-do application listening on localhost: ${port}`)
});
