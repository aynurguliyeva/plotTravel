// src/components/Auth.js
import React, { useState } from 'react';
import api from '../api';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Only prevent default if it's an actual form submit event
    try {
      if (isLogin) {
        // We use FormData because FastAPI OAuth2 expects it
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        
        const res = await api.post('/users/login', formData);
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
      } else {
        await api.post('/users/register', { email, password });
        alert("Registered! Now please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Auth failed: " + (err.response?.data?.detail || "Something went wrong"));
    }
  };

  // --- GUEST LOGIN FUNCTION ---
  const handleGuestLogin = async () => {
    const guestEmail = 'guest@plottravel.com'; // Change to whatever you registered
    const guestPassword = 'guest123';

    try {
      const formData = new FormData();
      formData.append('username', guestEmail);
      formData.append('password', guestPassword);

      const res = await api.post('/users/login', formData);
      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
    } catch (err) {
      alert("Guest login failed. Make sure you registered the guest account first!");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} // Added value binding
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} // Added value binding
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">{isLogin ? 'Enter' : 'Join'}</button>
      </form>

      <hr style={{ margin: '20px 0', opacity: 0.2 }} />

      {isLogin && (
        <button 
          onClick={handleGuestLogin}
          style={{ 
            backgroundColor: '#ff4d4d', // Your "Plot" red
            color: 'white',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}
        >
          Try as Guest ✨
        </button>
      )}

      <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', color: '#666' }}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
}