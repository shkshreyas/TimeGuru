import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Plus, Check, X, Clock, Brain, Coffee, Book, Code, Music, Film, GamepadIcon, ShoppingCart } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import type { Database } from '../types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];

const categories = [
  { id: 'study', name: 'Study', icon: Book, color: 'text-blue-400' },
  { id: 'coding', name: 'Coding', icon: Code, color: 'text-green-400' },
  { id: 'entertainment', name: 'Entertainment', icon: Film, color: 'text-purple-400' },
  { id: 'gaming', name: 'Gaming', icon: GamepadIcon, color: 'text-red-400' },
  { id: 'music', name: 'Music', icon: Music, color: 'text-yellow-400' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, color: 'text-pink-400' },
  { id: 'break', name: 'Break', icon: Coffee, color: 'text-orange-400' },
  { id: 'other', name: 'Other', icon: Brain, color: 'text-gray-400' },
];

export default function TimeTracker() {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({
    title: '',
    category: 'study',
    notes: '',
    is_productive: true,
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadTasks();
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(differenceInSeconds(new Date(), startTime));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const loadTasks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false });

    if (error) {
      toast.error('Failed to load tasks');
      return;
    }
    setTasks(data);
  };

  const handleStartTracking = () => {
    const now = new Date();
    setStartTime(now);
    setCurrentTask(prev => ({
      ...prev,
      start_time: now.toISOString(),
      user_id: user?.id,
    }));
    setIsTracking(true);
  };

  const handleStopTracking = async () => {
    if (!startTime || !user) return;

    const endTime = new Date();
    const duration = differenceInSeconds(endTime, startTime);

    const task = {
      ...currentTask,
      end_time: endTime.toISOString(),
      duration,
      user_id: user.id,
    };

    const { error } = await supabase.from('tasks').insert(task);

    if (error) {
      toast.error('Failed to save task');
      return;
    }

    toast.success('Task saved successfully');
    setIsTracking(false);
    setStartTime(null);
    setElapsedTime(0);
    setCurrentTask({
      title: '',
      category: 'study',
      notes: '',
      is_productive: true,
    });
    loadTasks();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 space-y-8"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Clock className="w-8 h-8 mr-2" />
          Time Tracker
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="What are you working on?"
            value={currentTask.title}
            onChange={(e) => setCurrentTask(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setCurrentTask(prev => ({ ...prev, category: category.id }))}
                className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                  currentTask.category === category.id
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                } border`}
              >
                <category.icon className={`w-5 h-5 mr-2 ${category.color}`} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <textarea
            placeholder="Add notes (optional)"
            value={currentTask.notes || ''}
            onChange={(e) => setCurrentTask(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            rows={3}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentTask(prev => ({ ...prev, is_productive: !prev.is_productive }))}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentTask.is_productive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {currentTask.is_productive ? (
                  <Check className="w-5 h-5 mr-2" />
                ) : (
                  <X className="w-5 h-5 mr-2" />
                )}
                {currentTask.is_productive ? 'Productive' : 'Unproductive'}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-4xl font-mono">
                {formatTime(elapsedTime)}
              </div>
              <button
                onClick={isTracking ? handleStopTracking : handleStartTracking}
                disabled={!currentTask.title}
                className={`p-4 rounded-full transition-colors ${
                  isTracking
                    ? 'bg-red-500 hover:bg-red-600'
                    : currentTask.title
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                {isTracking ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Recent Tasks</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-400">
                    {format(new Date(task.start_time), 'PPp')}
                    {task.end_time && ` - ${format(new Date(task.end_time), 'p')}`}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    task.is_productive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {task.is_productive ? 'Productive' : 'Unproductive'}
                  </span>
                  <span className="font-mono">
                    {formatTime(task.duration || 0)}
                  </span>
                </div>
              </div>
              {task.notes && (
                <p className="mt-2 text-sm text-gray-400">{task.notes}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}