require("dotenv").config();
const { time } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { title } = require("process");
const bodyParser = require("body-parser");
const moment=require("moment");
const connectMongodb = require("./init/mongodb");


const PORT = process.env.PORT || 8000;

// init app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const todoSchema=mongoose.Schema({title:{type:String,required:true},desc:String},{timestamps:true});
const Todo=mongoose.model("Todo",todoSchema);


// view engine
app.set("view engine", "ejs");

// static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));


// routes
app.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    res.locals.moment = moment;
    res.render("index", { title: "List Todos", todos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/newTodo", (req, res, next) => {
  try {
    res.render("newTodo", { title: "Add New Task" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/updateTodo/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("Todo not found");
    res.render("updateTodo", { title: "Update Your Task", todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/updateTodo/:id", async (req, res, next) => {
  try {
    const { title, description } = req.body;
    await Todo.findByIdAndUpdate(
      req.params.id,
      { title, desc: description, updatedAt: new Date() },
      { new: true }
    );
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/deleteTodo/:id", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("Todo not found");
    res.render("deleteTodo", { title: "Delete Your Task", todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/deleteTodo/:id", async (req, res, next) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/newTodo", async (req, res, next) => {
    try { const { title, description } = req.body;
    if(!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    const newTodo = new Todo({ title, desc : description });
    await newTodo.save();
    res.redirect("/");
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// listen server
async function startServer() {
  try {
    await connectMongodb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err.message);
  }
}

startServer();
