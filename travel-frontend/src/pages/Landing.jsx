import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPinned, Sparkles, Wand2, Search, Ticket, Lightbulb } from 'lucide-react';

const Landing = ({ onGetStarted, isMobile }) => {
  const howItWorksRef = useRef(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: '#FFFFFF',
      fontFamily: '"Inter", "Circular", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
      overflowX: 'hidden',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: isMobile ? '16px 20px' : '24px 80px', 
      borderBottom: '1px solid #EBEBEB',
      position: 'sticky',
      top: 0,
      background: '#FFFFFF',
      zIndex: 1000,
    },
    logo: {
      fontFamily: '"Inter", sans-serif',
      fontSize: isMobile ? '24px' : '30px',
      fontWeight: '800',
      cursor: 'pointer',
      color: '#222222',
      display: 'flex',
      alignItems: 'baseline',
      letterSpacing: '-1.2px',
    },
    logoDot: {
      display: 'inline-block',
      width: isMobile ? '8px' : '10px',
      height: isMobile ? '8px' : '10px',
      marginLeft: '2px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FF385C 0%, #601904 100%)',
      boxShadow: '0 2px 6px rgba(255, 56, 92, 0.3)',
    },
    navLinks: {
      display: 'flex',
      gap: isMobile ? '12px' : '32px',
      alignItems: 'center',
    },
    navLink: {
      display: isMobile ? 'none' : 'block',
      background: 'none',
      border: 'none',
      fontSize: '15px',
      fontWeight: '500',
      color: '#222222',
      cursor: 'pointer',
      padding: '8px',
    },
    primaryButton: {
      padding: isMobile ? '8px 16px' : '12px 24px',
      background: '#FF385C',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '13px' : '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    main: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '40px' : '60px',
      padding: isMobile ? '60px 20px' : '100px 80px',
      alignItems: isMobile ? 'flex-start' : 'center',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    content: {
      flex: 1,
      width: '100%',
      textAlign: 'left',
    },
    title: {
      fontSize: isMobile ? '42px' : '64px',
      fontWeight: '800',
      lineHeight: '1.1',
      marginBottom: '24px',
      color: '#222222',
      letterSpacing: '-1px',
    },
    titleHighlight: {
      color: '#FF385C',
    },
    subtitle: {
      fontSize: isMobile ? '18px' : '20px',
      color: '#717171',
      marginBottom: '40px',
      lineHeight: '1.5',
      maxWidth: '500px',
    },
    cta: {
      padding: '18px 36px',
      background: '#FF385C',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 14px rgba(255, 56, 92, 0.3)',
    },
    grid: {
      flex: 0.8,
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
      width: '100%',
    },
    card: {
      padding: isMobile ? '24px' : '40px',
      background: '#F7F7F7',
      borderRadius: '24px',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    cardTitle: {
      fontSize: '22px',
      fontWeight: '700',
      margin: '12px 0 4px 0',
      color: '#222',
    },
    cardText: {
      fontSize: '16px',
      color: '#717171',
      margin: 0,
      lineHeight: '1.4',
    },
    // NEW & UPDATED: HOW IT WORKS STYLES
    howSection: {
      padding: isMobile ? '80px 20px' : '120px 80px',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      // FIX: Added a full-width background container for zebra striping effect
    },
    howBackground: {
      background: '#F7F7F7', // Zebra stripe background color
      width: '100%',
    },
    howTitle: {
      fontSize: isMobile ? '32px' : '48px',
      fontWeight: '800',
      marginBottom: '16px',
      color: '#222',
      letterSpacing: '-1px',
    },
    howGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
      gap: '40px',
      marginTop: '60px',
    },
    howStep: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      // FIX: Cards can have a different background to pop on the stripe
      background: '#FFFFFF', 
      padding: '30px',
      borderRadius: '24px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
    },
    iconCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: '#FFEBF0', // Light pink background for icons to match brand
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FF385C',
      marginBottom: '10px',
    }
  };

  const steps = [
    {
      icon: <Search size={32} />,
      title: "Tell us your vibe",
      desc: "Pick your budget and the 'plot' of your trip—high-energy adventure or total relaxation."
    },
    {
      icon: <Sparkles size={32} />,
      title: "AI Crafts the Plot",
      desc: "Our engine builds a custom itinerary in seconds, finding hidden gems that fit your story."
    },
    {
      icon: <Ticket size={32} />,
      title: "Live the Story",
      desc: "Get a mobile-ready guide. Save it, share it, and go be the main character."
    }
  ];

  return (
    <motion.div style={styles.wrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <nav style={styles.nav}>
        <motion.div 
          style={styles.logo}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          plot<span style={styles.logoDot}></span>
        </motion.div>
        
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={scrollToHowItWorks}>How it works</button>
          <button style={styles.navLink} onClick={onGetStarted}>Destinations</button>
          <motion.button 
            style={styles.primaryButton} 
            onClick={onGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobile ? 'Get Started' : 'Join Plot AI'}
          </motion.button>
        </div>
      </nav>
      
      <main style={styles.main}>
        <motion.div 
          style={styles.content}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 style={styles.title}>
            Don't just travel.<br />
            <span style={styles.titleHighlight}>Do it for the plot.</span>
          </h1>
          <p style={styles.subtitle}>
            AI-powered itineraries for the adventures worth telling. 
          </p>
          <motion.button 
            style={styles.cta} 
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(255, 56, 92, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            Start plotting <Sparkles size={20} />
          </motion.button>
        </motion.div>

        <motion.div 
          style={styles.grid}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div 
            style={styles.card}
            whileHover={{ y: -5, background: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
          >
            <MapPinned size={isMobile ? 32 : 48} color="#FF385C" />
            <h3 style={styles.cardTitle}>Main Characters Only</h3>
            <p style={styles.cardText}>Curated experiences across several destinations</p>
          </motion.div>

          <motion.div 
            style={styles.card}
            whileHover={{ y: -5, background: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
          >
            <Wand2 size={isMobile ? 32 : 48} color="#FF385C" />
            <h3 style={styles.cardTitle}>Smart Plotting</h3>
            <p style={styles.cardText}>Optimized routes for maximum adventure</p>
          </motion.div>
        </motion.div>
      </main>

      {/* NEW: Full-width background container for zebra striping effect */}
      <div style={styles.howBackground}>
        {/* HOW IT WORKS SECTION */}
        <section ref={howItWorksRef} style={styles.howSection}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} // Trigger earlier for better feel
            transition={{ duration: 0.6 }}
          >
            <h2 style={styles.howTitle}>How it works</h2>
            <p style={{ color: '#717171', fontSize: '18px' }}>Three steps to your next great story.</p>
          </motion.div>

          <div style={styles.howGrid}>
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                style={styles.howStep}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                // NEW: Hover effect for step cards
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} 
              >
                <div style={styles.iconCircle}>{step.icon}</div>
                <h3 style={styles.cardTitle}>{step.title}</h3>
                <p style={styles.cardText}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* FINAL CTA SECTION */}
      <section style={{ ...styles.howSection, paddingBottom: '120px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #FF385C 0%, #601904 100%)',
            padding: isMobile ? '60px 30px' : '80px',
            borderRadius: '32px',
            color: '#FFFFFF',
            boxShadow: '0 20px 40px rgba(255, 56, 92, 0.2)',
          }}
        >
          <Lightbulb size={isMobile ? 48 : 64} style={{ marginBottom: '20px' }} />
          <h2 style={{ ...styles.howTitle, color: '#FFFFFF', marginBottom: '20px' }}>
            Your next great story starts here.
          </h2>
          <p style={{ color: '#FFEBF0', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            Stop planning, start plotting. Our AI is ready to craft an itinerary that makes you the main character of your own adventure.
          </p>
          <motion.button 
            style={{ ...styles.cta, background: '#FFFFFF', color: '#FF385C', boxShadow: '0 10px 20px rgba(255, 255, 255, 0.2)' }} 
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            Start plotting now <Sparkles size={20} />
          </motion.button>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Landing;