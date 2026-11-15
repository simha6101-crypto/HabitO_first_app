import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { login, register, guestLogin, theme } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your name');
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
      style={{ backgroundColor: theme.colors.canvasBg }}
    >
      <div 
        className="max-w-md w-full rounded-3xl bg-white border shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden"
        style={{ borderColor: theme.colors.cardBorder }}
      >
        {/* Top Pastel Aura */}
        <div 
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: theme.colors.primaryBg }}
        />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div 
            className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-sm border"
            style={{ 
              backgroundColor: theme.colors.primaryBg,
              borderColor: theme.colors.cardBorder 
            }}
          >
            {theme.badgeEmoji}
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            ProofHabit
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Every habit requires photo evidence. Build an emotional gallery of your consistency!
          </p>

          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{theme.name} Theme Active</span>
          </div>
        </div>

        {/* Sign In / Sign Up Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              !isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
              {error}
            </div>
          )}

          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sowmya Sri"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2"
                  style={{ borderColor: theme.colors.cardBorder }}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2"
                style={{ borderColor: theme.colors.cardBorder }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2"
                style={{ borderColor: theme.colors.cardBorder }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:opacity-95 active:scale-98 flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <span>{isRegister ? 'Create Hero Account' : 'Sign In to ProofHabit'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t w-full border-slate-200" />
          <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            or explore immediately
          </span>
        </div>

        {/* Instant Guest / Demo Mode Button */}
        <button
          type="button"
          onClick={guestLogin}
          className="w-full py-2.5 px-4 rounded-xl border text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xs"
          style={{ borderColor: theme.colors.cardBorder }}
        >
          <ShieldCheck className="w-4 h-4" style={{ color: theme.colors.primary }} />
          <span>Continue as Guest Demo Hero</span>
        </button>

        {/* Theme Quote at Bottom */}
        <p className="text-center text-[11px] italic text-slate-400">
          {theme.quote}
        </p>
      </div>
    </div>
  );
};
