import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { api } from './api';
import { Todo } from './types';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const data = await api.getTodos();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
        toast.error('Failed to fetch todos');
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const setLoadingState = (id: string | null, loading: boolean) => {
    setActionLoading(prev => ({
      ...prev,
      [id || 'new']: loading
    }));
  };

  const addTodo = async () => {
    if (inputValue.trim() === '') {
      toast.error('Please enter a task');
      return;
    }

    setLoadingState(null, true);
    try {
      const newTodo = await api.addTodo(inputValue);
      setTodos([newTodo, ...todos]);
      setInputValue('');
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
    } finally {
      setLoadingState(null, false);
    }
  };

  const toggleTodo = async (id: string, done: boolean) => {
    setLoadingState(id, true);
    try {
      const updatedTodo = await api.updateTodo(id, !done);
      setTodos(todos.map((todo) =>
        todo._id === id ? updatedTodo : todo
      ));
    } catch (error) {
      toast.error('Failed to update todo');
    } finally {
      setLoadingState(id, false);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoadingState(id, true);
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete todo');
    } finally {
      setLoadingState(id, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
            <h1 className="text-4xl font-bold text-white text-center mb-4">
              Todo List
            </h1>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={actionLoading['new']}
              />
              <button
                onClick={addTodo}
                disabled={actionLoading['new']}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading['new'] ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-400"
              >
                <p className="text-lg">No tasks yet. Add one to get started!</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {todos.map((todo) => (
                  <motion.div
                    key={todo._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group mb-2"
                  >
                    <button
                      onClick={() => toggleTodo(todo._id, todo.done)}
                      disabled={actionLoading[todo._id]}
                      className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        todo.done
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {todo.done && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </button>

                    <span
                      className={`flex-1 text-lg transition-all ${
                        todo.done
                          ? 'line-through text-gray-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {todo.title}
                    </span>

                    {actionLoading[todo._id] ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    ) : (
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {todos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500"
              >
                {todos.filter((t) => !t.done).length} of {todos.length}{' '}
                tasks remaining
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}