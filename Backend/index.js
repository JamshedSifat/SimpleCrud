const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri =
  "mongodb+srv://CRUD:a3aEFXA8SdGkgmIQ@cluster0.cqlesxd.mongodb.net/?appName=Cluster0";

// client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// 🔥 Collections (like your style)
let itemCollection;

async function run() {
  try {
    await client.connect();

    console.log("MongoDB Connected ✅");

    const db = client.db("crudDB");

    // ✅ Collection create (auto create on first insert)
    itemCollection = db.collection("items");

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Ready 🚀");

    // ================= ROUTES =================

    // GET all
    app.get("/items", async (req, res) => {
      const data = await itemCollection.find().toArray();
      res.json(data);
    });

    // POST (add)
    app.post("/items", async (req, res) => {
      const newItem = { name: req.body.name };
      const result = await itemCollection.insertOne(newItem);
      res.json(result);
    });

    // PUT (update)
    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;

      const result = await itemCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name: req.body.name } }
      );

      res.json(result);
    });

    // DELETE
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;

      const result = await itemCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });
  } catch (err) {
    console.log("Error ❌", err);
  }
}

run();

// server run
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});