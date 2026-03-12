// src/components/Auth.js
import React, { useState } from 'react';
import api from '../api';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Swagger uses 'username' field for OAuth2, even if it's an email
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
      alert("Auth failed: " + err.response?.data?.detail);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{isLogin ? 'Enter' : 'Join'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
}