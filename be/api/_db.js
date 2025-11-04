import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  const client = new MongoClient(process.env.MONGO_URI, {
    maxPoolSize: 10,
    minPoolSize: 1,
  });

  await client.connect();
  const db = client.db('todoApp');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export function getTodosCollection(db) {
  return db.collection('todos');
}
