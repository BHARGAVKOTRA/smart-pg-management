import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.RESIDENT);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    if (role === UserRole.ADMIN) {
      setIsLogin(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      /* ---------------- LOGIN ---------------- */
      if (isLogin) {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: activeRole
          })
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Login failed');
          return;
        }

        onLogin(data);
      }

      /* ---------------- REGISTER (RESIDENT ONLY) ---------------- */
      else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const newUser: User = {
          id: 'res-' + Math.random().toString(36).substring(2, 9),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: UserRole.RESIDENT,
          roomNumber: '',
          phoneNumber: ''
        };

        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Registration failed');
          return;
        }

        alert('Registration successful. Please login.');
        setIsLogin(true);
      }
    } catch {
      setError('Unable to reach server. Please check backend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-center mb-6">Smart PG</h1>

        {/* Role Selector */}
        <div className="flex mb-6">
          <button
            onClick={() => handleRoleChange(UserRole.RESIDENT)}
            className={`flex-1 p-3 rounded-l-xl font-bold ${
              activeRole === UserRole.RESIDENT
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200'
            }`}
          >
            Resident
          </button>
          <button
            onClick={() => handleRoleChange(UserRole.ADMIN)}
            className={`flex-1 p-3 rounded-r-xl font-bold ${
              activeRole === UserRole.ADMIN
                ? 'bg-slate-900 text-white'
                : 'bg-slate-200'
            }`}
          >
            Owner / Admin
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-4"
        >
          {!isLogin && activeRole === UserRole.RESIDENT && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-xl"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {!isLogin && activeRole === UserRole.RESIDENT && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-xl"
              value={formData.confirmPassword}
              onChange={e =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          )}

          {error && (
            <div className="text-red-600 text-sm font-bold">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white p-3 rounded-xl font-bold"
          >
            {isLoading
              ? 'Please wait...'
              : isLogin
              ? 'Login'
              : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
