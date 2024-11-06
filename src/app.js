import express from "express"
import env from "dotenv"
import mongoose from "mongoose";
import routes from './routes/books-routes.js'
import bodyParser from "body-parser"
env.config()
//usamos expresss para los middlewares 
const app= express();
app.use(bodyParser.json())//PArseador de bodys

//Aqui se conecta la base de datos 
mongoose.connect(process.env.MONGO_URL,{dbName:process.env.MONGO_DB_NAME})
const db=mongoose.connection
app.use('/books', routes)


const port=process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Servidor iniciado en el puerto ${port}`)
})