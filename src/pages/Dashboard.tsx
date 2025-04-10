import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, X, CheckCircle, Circle, Trash2, Tag, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  category: string;
  streak: number;
  lastCompleted: string | null;
  completedDates: string[];
}

const categories = ['Health', 'Productivity', 'Learning', 'Fitness', 'Mindfulness', 'Other'];

function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekly'>('daily');
  const [newHabitCategory, setNewHabitCategory] = useState('Other');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      frequency: newHabitFrequency,
      category: newHabitCategory,
      streak: 0,
      lastCompleted: null,
      completedDates: [],
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = habit.completedDates.includes(today);
    
    const updatedHabits = habits.map(h => {
      if (h.id === habit.id) {
        const completedDates = isCompleted
          ? h.completedDates.filter(date => date !== today)
          : [...h.completedDates, today];
        
        return {
          ...h,
          completedDates,
          lastCompleted: isCompleted ? null : today,
          streak: isCompleted ? h.streak - 1 : h.streak + 1
        };
      }
      return h;
    });

    setHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessages = [
      ...chatMessages,
      { text: currentMessage, isUser: true },
      { text: "I'm here to help you build better habits! What specific guidance would you like?", isUser: false }
    ];

    setChatMessages(newMessages);
    setCurrentMessage('');
  };

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const getCompletionRate = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
        total: habits.length,
        rate: habits.length ? (completedCount / habits.length) * 100 : 0
      };
    }).reverse();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Progress Overview</h2>
        <div className="bg-gray-800 p-6 rounded-lg">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={getCompletionRate()}>
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Habit Form */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Enter new habit..."
            className="flex-1 bg-gray-700 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={newHabitFrequency}
            onChange={(e) => setNewHabitFrequency(e.target.value as 'daily' | 'weekly')}
            className="bg-gray-700 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <select
            value={newHabitCategory}
            onChange={(e) => setNewHabitCategory(e.target.value)}
            className="bg-gray-700 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={addHabit}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {filteredHabits.map(habit => (
          <div key={habit.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(habit)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {habit.completedDates.includes(new Date().toISOString().split('T')[0]) 
                    ? <CheckCircle size={24} /> 
                    : <Circle size={24} />
                  }
                </button>
                <div>
                  <h3 className="text-lg font-semibold">{habit.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{habit.frequency}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      {habit.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BarChart2 size={14} />
                      Streak: {habit.streak} days
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chatbot */}
      <div className={`fixed bottom-4 right-4 ${isChatOpen ? 'w-96' : 'w-auto'}`}>
        {isChatOpen ? (
          <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold">Habit Assistant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask for habit advice..."
                  className="flex-1 bg-gray-700 text-gray-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 p-4 rounded-full shadow-lg"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;