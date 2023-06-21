const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const post = process.env.PORT||5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mz3fw7v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'unauthorized access'})
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      res.status(403).send({message: 'unauthorized access'})
    }
    req.decoded = decoded;
    next();
  })
}

async function run(){
    try{
       const foodCollection = client.db('tastiFoodi').collection('foods');
       const reviewCollection = client.db('tastiFoodi').collection('reviews');

       app.post('/jwt', (req, res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1s'});
        res.send({token});
        // console.log(user);
      })

       app.get('/foods', async(req, res) =>{
        const query = {};
        const cursor = foodCollection.find(query);
        const foods = await cursor.toArray();
        // console.log(foods);
        res.send(foods);
       });

       app.get('/foods/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const food = await foodCollection.findOne(query);
        // console.log(food); 
        res.send(food)
       });

       app.get('/foods-limit', async(req, res)=>{
        const query = {};
        const cursor = foodCollection.find(query);
        const foods = await cursor.limit(3).toArray();
        res.send(foods);
      });

      app.get('/reviews', async(req, res)=>{
        console.log(req.headers.authorization);
        console.log(req.query.email);
        
        // const decoded = req.decoded;
        // console.log('inside reviews api', decoded);
        // if(decoded?.email !== req.query.email){
        //   return res.status(403).send({message: 'unauthorized access'})
        // }
        let query = {};
        
        if(req.query.email){
           query = {
            email: req.query.email
          }
        }

        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        console.log(reviews);
        res.send(reviews);
      })
  
      app.post('/reviews', async(req, res)=>{
        const reviews = req.body;
        const result = await reviewCollection.insertOne(reviews);
        console.log(result);
        res.send(result);
      });

      app.put('/reviews/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const reviews = req.body;
        console.log(reviews);
        const updatedUser = {
          $set: {
            review: '',
            rating: ''
          }
        }
        const result = await reviewCollection.updateOne(filter, updatedUser);
        console.log(result);
        res.send(result)
  
      })

      app.delete('/reviews/:id', async(req, res)=>{
        const id = req.params.id;
        console.log(id);
        const query = {_id: new ObjectId(id)};
        const result = await reviewCollection.deleteOne(query);
        res.send(result)
      })

    }
    finally{

    }
}

run().catch(error => console.log(error));



app.get('/', (req, res)=>{
    res.send('Tastyfoodi is running.....')
})

app.listen(post, ()=>{
    console.log('Tastyfoodi is running on ${port}')
})