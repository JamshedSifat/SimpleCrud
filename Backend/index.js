const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://CRUD:a3aEFXA8SdGkgmIQ@cluster0.cqlesxd.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Connection Management
let db;

async function connectDB() {
  if (db) return db; 
  await client.connect();
  db = client.db("crudDB");
  return db;
}

// ================= ROUTES =================

app.get("/", (req, res) => res.send("Server is ready!"));

// GET all
app.get("/items", async (req, res) => {
  const database = await connectDB();
  const items = await database.collection("items").find().toArray();
  res.json(items);
});

// POST (add)
app.post("/items", async (req, res) => {
  const database = await connectDB();
  const newItem = { name: req.body.name };
  const result = await database.collection("items").insertOne(newItem);
  res.json(result);
});

// PUT (update)
app.put("/items/:id", async (req, res) => {
  const database = await connectDB();
  const id = req.params.id;
  const result = await database.collection("items").updateOne(
    { _id: new ObjectId(id) },
    { $set: { name: req.body.name } }
  );
  res.json(result);
});

// DELETE
app.delete("/items/:id", async (req, res) => {
  const database = await connectDB();
  const id = req.params.id;
  const result = await database.collection("items").deleteOne({
    _id: new ObjectId(id),
  });
  res.json(result);
});

//for veracel
module.exports = app;