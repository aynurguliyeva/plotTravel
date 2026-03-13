import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Auth = ({ onAuth, loading }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(email, pass, isRegistering);
  };

  // --- NEW: Guest Logic ---
  const handleGuestLogin = () => {
    onAuth('guest@plottravel.com', 'guest123', false);
  };

  return (
    <motion.div 
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        style={styles.card}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <h2 style={styles.title}>{isRegistering ? 'Create an account' : 'Welcome back'}</h2>
        <p style={styles.subtitle}>
          {isRegistering ? 'Start planning your perfect trip' : 'Continue your journey'}
        </p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            style={styles.input}
            required
          />
          <motion.button 
            type="submit" 
            style={styles.submit} 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Please wait...' : (isRegistering ? 'Sign up' : 'Sign in')}
          </motion.button>
        </form>

        {/* --- NEW: Guest Login Button --- */}
        {!isRegistering && (
          <motion.button
            onClick={handleGuestLogin}
            style={styles.guestButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try as Guest ✨
          </motion.button>
        )}
        
        <div style={styles.footer}>
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={styles.toggle}
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#F7F7F7',
  },
  card: {
    width: '400px',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#222222',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#717171',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  input: {
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #DDDDDD',
    fontSize: '16px',
    outline: 'none',
  },
  submit: {
    padding: '16px',
    background: '#FF385C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
 container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#F7F7F7',
  },
  card: {
    width: '400px',
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#222222',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#717171',
    marginBottom: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  input: {
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #DDDDDD',
    fontSize: '16px',
    outline: 'none',
  },
  submit: {
    padding: '16px',
    background: '#FF385C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  // ADD THIS NEW STYLE
  guestButton: {
    width: '100%',
    padding: '14px',
    background: 'transparent',
    color: '#FF385C',
    border: '2px solid #FF385C',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  footer: {
    textAlign: 'center',
  },
  toggle: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: '#717171',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Auth;