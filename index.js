const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const post = process.env.PORT||5000;


app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mz3fw7v.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



app.get('/', (req, res)=>{
    res.send('Tastyfoodi is running.....')
})

app.listen(post, ()=>{
    console.log('Tastyfoodi is running on ${port}')
})