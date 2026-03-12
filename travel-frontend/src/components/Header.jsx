import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const Header = ({ email, activeTab, setActiveTab, activeTrips, completedTrips, onLogout, onLogoClick, isMobile }) => {
  const styles = {
  header: {
   display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      // FIX: Reduce horizontal padding so logo moves left
      padding: isMobile ? '0 20px' : '0 40px', 
      height: '80px',
      borderBottom: '1px solid #EBEBEB',
      position: 'sticky',
      top: 0,
      background: '#FFFFFF',
      zIndex: 100,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logo: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '30px', // Slightly larger for the header
    fontWeight: '800', // Extra bold for that premium feel
    cursor: 'pointer',
    color: '#222222',
    display: 'flex',
    alignItems: 'baseline',
    letterSpacing: '-1.2px',
  },
  logoDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    marginLeft: '2px',
    borderRadius: '50%',
     background: 'linear-gradient(135deg, #FF385C 0%, #601904 100%)', // Matching Landing gradient
    boxShadow: '0 2px 6px rgba(255, 56, 92, 0.3)',
  },
  headerTabs: {
    display: 'flex',
    gap: '8px',
  },
  tab: {
    padding: '10px 16px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    color: '#717171',
    cursor: 'pointer',
    borderRadius: '30px',
    transition: 'all 0.2s',
  },
  tabActive: {
    padding: '10px 16px',
    background: '#F7F7F7',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    color: '#222222',
    cursor: 'pointer',
    borderRadius: '30px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  profileInitials: {
  fontFamily: '"Inter", sans-serif', // change to any font you like
  fontWeight: '700',
  fontSize: '16px',
  color: '#FFFFFF',
  letterSpacing: '1px'
},
  profile: {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #FF385C 0%, #601904 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
  logout: {
    background: 'none',
    border: 'none',
    color: '#717171',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
  },
};

  return (
    <motion.header 
      style={styles.header}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div style={styles.headerLeft}>
       <div style={styles.logo} onClick={onLogoClick}>
  plot<span style={styles.logoDot}></span>
</div>
        <div style={styles.headerTabs}>
          <motion.button 
            style={activeTab === 'my-trips' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('my-trips')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Active trips ({activeTrips.length})
          </motion.button>
          <motion.button 
            style={activeTab === 'completed' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('completed')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Completed ({completedTrips.length})
          </motion.button>
        </div>
      </div>
      
      <div style={styles.headerRight}>
        <motion.button 
          style={styles.profile}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
         <span style={styles.profileInitials}>
  {email?.slice(0,2).toUpperCase()}
</span>
        </motion.button>
        <motion.button 
          onClick={onLogout} 
          style={styles.logout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <LogOut size={20} />
        </motion.button>
      </div>
    </motion.header>
  );
};


export default Header;