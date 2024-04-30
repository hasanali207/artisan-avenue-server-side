const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT  || 5000

app.use(express.json())
app.use(cors())
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wdiwjgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("craftItem");
    const itemCollection = database.collection("Items");
    const homeCollection = database.collection("home_data");
        
    app.post('/items', async(req, res) =>{
        const newItem = req.body
        console.log(newItem)
        const result = await itemCollection.insertOne(newItem)
        res.send(result)
    })


    app.get('/items', async(req, res)=>{
        const cursor = itemCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/data/homedata', async(req, res)=>{
        const cursor = homeCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
   
    // details
    app.get('/items/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await itemCollection.findOne(query)
      res.send(result)
    })
 

    app.delete('/items/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await itemCollection.deleteOne(query)
      res.send(result)
    })


    app.get('/craftlist/:email', async(req, res)=>{
      const email = req.params.email
      const query = {user_email : email}
      const result = await itemCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/data/homedata/:subcategory_name', async(req, res)=>{
      const subcategory_name = req.params.subcategory_name
      const query = {subcategory_name : subcategory_name}
      const result = await homeCollection.find(query).toArray()
      res.send(result)
    })

     // details
     app.get('/data/sigledata/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await homeCollection.findOne(query)
      res.send(result)
    })

       // update
       app.get('/items/update/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await itemCollection.findOne(query)
        res.send(result)
      })
       app.put('/updateItem/:id', async(req, res)=>{
        const id = req.params.id
        const item = req.body
        const query = {_id : new ObjectId(id)}
       const data = {
          $set:{
            photo: item.photo,
            user_name: item.user_name,
            user_email: item.user_email,
            stock_status: item.stock_status,
            processing_time: item.processing_time,
            customization: item.customization,
            rating: item.rating,
            price: item.price,
            short_description: item.short_description,
            subcategory_name: item.subcategory_name,
            item_name: item.item_name,
          } 
        }
        const result = await itemCollection.updateOne(query, data )
        console.log(result);
        res.send(result)
        
      })


  
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', async(req, res) =>{
    res.send('Start Server ')
})

app.listen(port, () =>{
    console.log(`Server is Runnig ${port}` );
    
})