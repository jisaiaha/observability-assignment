const tracer = require("./tracing")("todo-service");
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const port = 3000;
let db;

const startServer = async () => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017/");
    db = client.db("todo");

    await db.collection("todos").insertMany([
      { id: "1", title: "Buy groceries" },
      { id: "2", title: "Install Aspecto" },
      { id: "3", title: "Buy my own name domain" },
    ]);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();

app.get("/todo", async (req, res) => {
  try {
    const todos = await db.collection("todos").find({}).toArray();
    res.send(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/todo/:id", async (req, res) => {
  try {
    const todo = await db.collection("todos").findOne({ id: req.params.id });
    if (todo) {
      res.send(todo);
    } else {
      res.status(404).send({ message: "Todo not found" });
    }
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});
