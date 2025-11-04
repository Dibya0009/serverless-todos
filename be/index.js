import express from 'express';
import dotenv from 'dotenv';
import { getTodosCollection, connectToDatabase } from './api/_db.js';
import addTodoHandler from './api/addTodo.js';
import getTodosHandler from './api/getTodos.js';
import updateTodoHandler from './api/updateTodo.js';
import deleteTodoHandler from './api/deleteTodo.js';
import cors from 'cors'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173"
}))
// Wrap API handlers to work with Express
const wrapHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Routes
app.get('/api/getTodos', wrapHandler(getTodosHandler));
app.post('/api/addTodo', wrapHandler(addTodoHandler));
app.put('/api/updateTodo', wrapHandler(updateTodoHandler));
app.delete('/api/deleteTodo', wrapHandler(deleteTodoHandler));

// Start server
app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
});
