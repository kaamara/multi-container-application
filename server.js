const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const Todo = mongoose.model('Todo', new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}));

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({ title: req.body.title });
  await todo.save();
  res.status(201).send(todo);
});

app.get('/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).send('Not found');
  res.send(todo);
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, 
    { title: req.body.title, completed: req.body.completed }, { new: true });
  res.send(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));