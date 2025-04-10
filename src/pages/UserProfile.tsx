import React, { useState, useEffect } from 'react';
import { Calendar, Award, Target, BarChart2 } from 'lucide-react';

interface UserStats {
  totalHabits: number;
  completedToday: number;
  longestStreak: number;
  completionRate: number;
}

const UserProfile = () => {
  const [stats, setStats] = useState<UserStats>({
    totalHabits: 0,
    completedToday: 0,
    longestStreak: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const longestStreak = Math.max(...habits.map(h => h.streak));
    const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
    const totalPossibleCompletions = habits.length * 30; // Last 30 days
    
    setStats({
      totalHabits: habits.length,
      completedToday,
      longestStreak,
      completionRate: totalPossibleCompletions ? (totalCompletions / totalPossibleCompletions) * 100 : 0,
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold">
              {stats.completionRate.toFixed(0)}%
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Your Progress</h1>
            <p className="text-gray-400">Keep up the great work!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Target className="w-8 h-8 text-purple-400" />}
            title="Total Habits"
            value={stats.totalHabits}
          />
          <StatCard
            icon={<Calendar className="w-8 h-8 text-purple-400" />}
            title="Completed Today"
            value={stats.completedToday}
          />
          <StatCard
            icon={<Award className="w-8 h-8 text-purple-400" />}
            title="Longest Streak"
            value={`${stats.longestStreak} days`}
          />
          <StatCard
            icon={<BarChart2 className="w-8 h-8 text-purple-400" />}
            title="Completion Rate"
            value={`${stats.completionRate.toFixed(1)}%`}
          />
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Achievement Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AchievementBadge
              icon="🎯"
              title="First Habit"
              description="Created your first habit"
              unlocked={stats.totalHabits > 0}
            />
            <AchievementBadge
              icon="🔥"
              title="Streak Master"
              description="Maintained a 7-day streak"
              unlocked={stats.longestStreak >= 7}
            />
            <AchievementBadge
              icon="⭐"
              title="Perfect Day"
              description="Completed all habits in one day"
              unlocked={stats.completedToday === stats.totalHabits && stats.totalHabits > 0}
            />
            <AchievementBadge
              icon="🏆"
              title="Habit Champion"
              description="Achieved 80% completion rate"
              unlocked={stats.completionRate >= 80}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) => (
  <div className="bg-gray-700 rounded-lg p-6">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <h3 className="text-sm text-gray-400">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const AchievementBadge = ({ icon, title, description, unlocked }: { icon: string; title: string; description: string; unlocked: boolean }) => (
  <div className={`bg-gray-700 rounded-lg p-4 text-center ${!unlocked && 'opacity-50'}`}>
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default UserProfile;