import { connectToDatabase, getTodosCollection } from './_db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use DELETE.'
    });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Todo ID is required'
      });
    }

    const { db } = await connectToDatabase();
    const todosCollection = getTodosCollection(db);

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }

    const result = await todosCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete todo'
    });
  }
}
