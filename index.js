const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// beingAdmin
// 0JGFVBTT9B9SVZZn

// Middleware 
app.use(cors());
app.use(express.json());

//Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efjqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const activityCollection = client.db("beingHuman").collection("volunteerActivities");
        const volunteerInfo = client.db("beingHuman").collection("volunteerInfo");
        
        // Get all activities 
        app.get("/activities", async (req, res) => {
            const query = req.query;
            const cursor = activityCollection.find(query);
            const activities = await cursor.toArray();
            res.send(activities);
        })

        // Get Volunteer info
        app.get("/volunteerInfo", async(req, res) => {
            const query = req.query;
            const cursor = volunteerInfo.find(query);
            const volunteers = await cursor.toArray();
            res.send(volunteers)
        })

        // POST a activity in the database
        app.post("/activity", async (req, res) => {
            const activity = req.body;
            const result = await activityCollection.insertOne(activity);
            res.send(result);
        })

        // POST volunteer info in the database
        app.post("/volunteerInfo", async (req, res) => {
            const info = req.body;
            const result = await volunteerInfo.insertOne(info);
            res.send(result);
        })

        // Delete
        app.delete("/volunteerInfo/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await volunteerInfo.deleteOne(query);
            res.send(result);
        })

        app.get("/check", (req, res) => {
            res.send("Just checking if everything is okay")
        })
    }
    finally {

    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Being Human Server is up and running!");
})

app.listen(port, () => {
    console.log('Listening to port', port);
})