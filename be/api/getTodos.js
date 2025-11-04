import { connectToDatabase, getTodosCollection } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET.'
    });
  }

  try {
    const { db } = await connectToDatabase();
    const todosCollection = getTodosCollection(db);

    const todos = await todosCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      data: todos,
      message: 'Todos retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch todos'
    });
  }
}
