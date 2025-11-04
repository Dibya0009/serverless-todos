import { connectToDatabase, getTodosCollection } from './_db.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use PUT.'
    });
  }

  try {
    const { id, done } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Todo ID is required'
      });
    }

    if (typeof done !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Done must be a boolean value'
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

    const result = await todosCollection.updateOne(
      { _id: objectId },
      { $set: { done } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: { id, done },
      message: 'Todo updated successfully'
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update todo'
    });
  }
}
