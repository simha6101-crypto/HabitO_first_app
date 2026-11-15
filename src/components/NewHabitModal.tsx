import React, { useEffect, useState } from 'react';
import { X, Plus, Sparkles, Dumbbell, Droplets, BookOpen, Monitor, Heart, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Habit } from '../types';

export const NewHabitModal: React.FC = () => {
  const {
    isNewHabitModalOpen,
    setIsNewHabitModalOpen,
    addHabit,
    updateHabit,
    editingHabit,
    theme
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Fitness' | 'Health' | 'Mindset' | 'Productivity' | 'Creativity'>('Fitness');
  const [targetDays, setTargetDays] = useState(7);
  const [icon, setIcon] = useState('dumbbell');
  const [color, setColor] = useState('#EF4444');

  useEffect(() => {
    if (!isNewHabitModalOpen) return;

    if (editingHabit) {
      setTitle(editingHabit.title);
      setCategory(editingHabit.category);
      setTargetDays(editingHabit.targetDaysPerWeek);
      setIcon(editingHabit.icon);
      setColor(editingHabit.color);
      return;
    }

    setTitle('');
    setCategory('Fitness');
    setTargetDays(7);
    setIcon('dumbbell');
    setColor('#EF4444');
  }, [editingHabit, isNewHabitModalOpen]);

  if (!isNewHabitModalOpen) return null;

  const categories = ['Fitness', 'Health', 'Mindset', 'Productivity', 'Creativity'] as const;
  const icons = [
    { id: 'dumbbell', label: 'Workout', icon: Dumbbell },
    { id: 'droplets', label: 'Hydration', icon: Droplets },
    { id: 'book-open', label: 'Reading', icon: BookOpen },
    { id: 'monitor', label: 'Work', icon: Monitor },
    { id: 'sparkles', label: 'Mindset', icon: Sparkles },
    { id: 'heart', label: 'Wellness', icon: Heart },
  ];

  const colors = [
    '#EF4444', '#0284C7', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const habitData: Pick<Habit, 'title' | 'category' | 'icon' | 'cadence' | 'targetDaysPerWeek' | 'color'> = {
      title: title.trim(),
      category,
      icon,
      cadence: targetDays === 7 ? 'daily' : targetDays === 5 ? 'weekdays' : 'custom',
      targetDaysPerWeek: targetDays,
      color
    };

    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNewHabitModalOpen(false)}
      />

      {/* Modal Card */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{ borderColor: theme.colors.cardBorder }}
      >
        <div 
          className="p-5 border-b flex items-center justify-between"
          style={{ backgroundColor: theme.colors.primaryBg, borderColor: theme.colors.cardBorder }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{theme.badgeEmoji}</span>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <p className="text-xs text-slate-600">
                {editingHabit ? 'Update your habit details without losing proof history' : 'Requires daily photo proof to complete'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewHabitModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Habit Name</label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning 20m Yoga Flow"
              className="w-full px-3.5 py-2.5 rounded-xl border text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all"
              style={{ borderColor: theme.colors.cardBorder }}
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    category === cat 
                      ? 'shadow-xs font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={{
                    backgroundColor: category === cat ? theme.colors.primaryBg : 'white',
                    borderColor: category === cat ? theme.colors.primary : theme.colors.cardBorder,
                    color: category === cat ? theme.colors.primary : undefined
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Target */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Weekly Target: {targetDays} days / week
            </label>
            <div className="flex gap-2">
              {[3, 4, 5, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setTargetDays(days)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    targetDays === days 
                      ? 'shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  style={{
                    backgroundColor: targetDays === days ? theme.colors.primaryBg : 'white',
                    borderColor: targetDays === days ? theme.colors.primary : theme.colors.cardBorder,
                    color: targetDays === days ? theme.colors.primary : undefined
                  }}
                >
                  {days === 7 ? 'Every Day' : `${days} Days`}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Choose Icon</label>
            <div className="flex gap-2">
              {icons.map((item) => {
                const Icon = item.icon;
                const isSelected = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 shadow-xs' : 'hover:bg-slate-50 text-slate-500'
                    }`}
                    style={{
                      backgroundColor: isSelected ? theme.colors.primaryBg : 'white',
                      borderColor: isSelected ? theme.colors.primary : theme.colors.cardBorder,
                      color: isSelected ? theme.colors.primary : undefined,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Card Accent Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewHabitModalOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-50"
              style={{ borderColor: theme.colors.cardBorder }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:opacity-95"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
