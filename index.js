const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqqts.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        const database = client.db('turism');
        const servicesCollection = database.collection('service');
        const bookingCollection = database.collection('booking');

        // GET API
        app.get('/service', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });


        // get single service
        app.get('/service-details/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Getting single data : ", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // post api
        app.post('/service', async (req, res) => {
            const service = req.body;
            console.log("Hit the post api", service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // GET API
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        });

        // post api
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            console.log("Hit the post api", booking);

            const result = await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result);
        });


        // delete booking
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running blog server');
});

app.listen(port, () => {
    console.log('Running Blog server on port', port);
})