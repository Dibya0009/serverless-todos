import { Todo, ApiResponse } from './types';

const API_BASE_URL = 'http://localhost:3000/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Operation failed');
  }
  return data.data;
};

export const api = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await fetch(`${API_BASE_URL}/getTodos`);
    return handleResponse<Todo[]>(response);
  },

  addTodo: async (title: string): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/addTodo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return handleResponse<Todo>(response);
  },

  updateTodo: async (id: string, done: boolean): Promise<Todo> => {
    const response = await fetch(`${API_BASE_URL}/updateTodo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done }),
    });
    return handleResponse<Todo>(response);
  },

  deleteTodo: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/deleteTodo`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return handleResponse<void>(response);
  },
};