import { connectToDatabase, getTodosCollection } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required and must be a non-empty string'
      });
    }

    const { db } = await connectToDatabase();
    const todosCollection = getTodosCollection(db);

    const newTodo = {
      title: title.trim(),
      done: false,
      createdAt: new Date()
    };

    const result = await todosCollection.insertOne(newTodo);

    const insertedTodo = {
      _id: result.insertedId,
      ...newTodo
    };

    return res.status(201).json({
      success: true,
      data: insertedTodo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create todo'
    });
  }
}
