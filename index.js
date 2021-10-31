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

        // GET API
        app.get('/service', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        // // get api
        // app.get('/blog', async (req, res) => {
        //     const cursor = servicesCollection.find({});
        //     const page = req.query.page;
        //     const size = parseInt(req.query.size);
        //     let blog;
        //     const count = await cursor.count();

        //     if (page) {
        //         blog = await cursor.skip(page * size).limit(size).toArray();
        //     }
        //     else {
        //         blog = await cursor.toArray();
        //     }
        //     res.send({
        //         count,
        //         blog
        //     });
        // });

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
            // const blog = {
            //     "title": "Hello",
            //     "description": "lorem",
            //     "img": "gg"
            // }
            console.log("Hit the post api", service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // // delete blog
        // app.delete('/blog/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await servicesCollection.deleteOne(query);
        //     res.json(result);
        // });

        // // get single blog
        // app.get('/update-blog/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log("Getting single data : ", id);
        //     const query = { _id: ObjectId(id) };
        //     const blog = await servicesCollection.findOne(query);
        //     res.send(blog);
        // });

        // // update blog
        // app.put('/update-blog/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updateBlog = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const option = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             title: updateBlog.title,
        //             description: updateBlog.description,
        //             img: updateBlog.img
        //         },
        //     };
        //     const result = await servicesCollection.updateOne(filter, updateDoc, option)
        //     console.log("Updating id : ", id);
        //     res.json(result);
        // })
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