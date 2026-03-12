import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, MapPin, Globe, DollarSign, 
  ChevronUp, ChevronDown, CheckCircle, Circle, 
  Heart, Bookmark, Camera, Utensils, Hotel,
  Coffee, Zap, Flame
} from 'lucide-react';

const getDifficultyBadge = (days, activitiesCount) => {
  const score = days + (activitiesCount / 2);
  if (score <= 5) return { label: 'Relaxed', icon: Coffee, color: '#0B4F6C', bg: '#E3F2FD' };
  if (score <= 10) return { label: 'Moderate', icon: Zap, color: '#7B4B3A', bg: '#FEF3E2' };
  return { label: 'Intensive', icon: Flame, color: '#B23B3B', bg: '#FFEBEE' };
};

const getCityColor = (index) => {
  const colors = ['#FF385C', '#FFA500', '#00A699', '#FC642D', '#484848'];
  return colors[index % colors.length];
};

const formatBudget = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const TripModal = ({ 
  trip, 
  isSaved, 
  onClose, 
  onToggleSave, 
  onToggleActivity, 
  onToggleFavorite, 
  checkedActivities, 
  favoriteActivities 
}) => {
  const [expandedDay, setExpandedDay] = useState(null);
  
  const destinations = trip.destinations || [trip.destination];
  const totalBudget = trip.budget || 1500;
  const tripMood = trip.itinerary_data?.preferences?.[0] || '🍦 Chill';
  const activitiesCount = trip.itinerary_data?.plan?.flatMap(d => d.activities).length || 0;
  const diff = getDifficultyBadge(trip.days, activitiesCount);
  const DiffIcon = diff.icon;

  const progress = (() => {
    if (!trip.itinerary_data?.plan) return 0;
    const allActivities = [];
    trip.itinerary_data.plan.forEach((day, dayIdx) => {
      day.activities.forEach((act, actIdx) => {
        allActivities.push(`${trip.id}-day${dayIdx}-act${actIdx}`);
      });
    });
    if (allActivities.length === 0) return 0;
    const doneCount = allActivities.filter(key => checkedActivities[key]).length;
    return Math.round((doneCount / allActivities.length) * 100);
  })();

  return (
    <motion.div 
      style={styles.overlay} 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        style={styles.container} 
        onClick={e => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
        
        {/* Header with gradient background */}
        <div style={styles.header}>
          <div style={styles.headerGradient}>
            <div style={styles.headerContent}>
              <div style={styles.badgeContainer}>
                <motion.span 
                  style={styles.badgeDark}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Calendar size={14} /> {trip.days} days
                </motion.span>
                <motion.span 
                  style={{ ...styles.badge, background: diff.bg, color: diff.color }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <DiffIcon size={14} /> {diff.label}
                </motion.span>
              </div>
              
              <motion.div 
                style={styles.citiesContainer}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Globe size={24} color="#FFFFFF" />
                <h1 style={styles.title}>
                  {destinations.map((city, idx) => (
                    <span key={idx}>
                      {city}
                      {idx < destinations.length - 1 && <span style={styles.separator}> → </span>}
                    </span>
                  ))}
                </h1>
              </motion.div>
              
              <motion.div 
                style={styles.stats}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div style={styles.statItem}>
                  <DollarSign size={16} color="#FF385C" />
                  <span style={styles.statLabel}>Budget</span>
                  <span style={styles.statValue}>{formatBudget(totalBudget)}</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.statItem}>
                  <span style={styles.statValue}>{tripMood}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Journey Progress</span>
            <span style={styles.progressPercentage}>{progress}%</span>
          </div>
          <div style={styles.progressTrack}>
            <motion.div 
              style={{ ...styles.progressFill, width: `${progress}%` }} 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Itinerary */}
        <div style={styles.content}>
          {trip.itinerary_data.plan.map((day, idx) => (
            <motion.div 
              key={idx} 
              style={styles.daySection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div 
                style={styles.dayHeader} 
                onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
              >
                <div style={styles.dayHeaderLeft}>
                  <MapPin size={20} color="#FF385C" />
                  <div>
                    <h3 style={styles.dayTitle}>Day {day.day}</h3>
                    <p style={styles.daySummary}>{day.summary}</p>
                  </div>
                </div>
                {expandedDay === idx ? 
                  <ChevronUp size={20} color="#717171" /> : 
                  <ChevronDown size={20} color="#717171" />
                }
              </div>
              
              <AnimatePresence>
                {expandedDay === idx && (
                  <motion.div 
                    style={styles.activities}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {day.activities.map((act, i) => {
                      const key = `${trip.id}-day${idx}-act${i}`;
                      const isFavorite = favoriteActivities[key];
                      return (
                        <motion.div 
                          key={i} 
                          style={styles.activityCard}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.02, backgroundColor: '#f0f0f0' }}
                        >
                          <div style={styles.activityIcon}>
                            {i % 3 === 0 ? <Camera size={20} color={getCityColor(i)} /> :
                             i % 3 === 1 ? <Utensils size={20} color={getCityColor(i)} /> :
                             <Hotel size={20} color={getCityColor(i)} />}
                          </div>
                          <div style={styles.activityContent}>
                            <div style={styles.activityHeader}>
                              <p style={styles.activityName}>{act}</p>
                              <div style={styles.activityActions}>
                                <motion.button 
                                  onClick={() => onToggleActivity(key)} 
                                  style={styles.activityBtn}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {checkedActivities[key] ? 
                                    <CheckCircle size={20} color="#FF385C" /> : 
                                    <Circle size={20} color="#717171" />
                                  }
                                </motion.button>
                                <motion.button 
                                  onClick={() => onToggleFavorite(key)} 
                                  style={styles.activityBtn}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Heart 
                                    size={20} 
                                    color={isFavorite ? "#FF385C" : "#717171"} 
                                    fill={isFavorite ? "#FF385C" : "none"} 
                                  />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <motion.button 
            onClick={() => onToggleSave(trip.id)} 
            style={styles.saveBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bookmark size={20} color={isSaved ? "#FF385C" : "#717171"} fill={isSaved ? "#FF385C" : "none"} />
            {isSaved ? 'Saved' : 'Save trip'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    background: '#FFFFFF',
    borderRadius: '16px',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 10,
    background: '#FFFFFF',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    minHeight: '250px',
  },
  headerGradient: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    display: 'flex',
    alignItems: 'flex-end',
  },
  headerContent: {
    color: '#FFFFFF',
    width: '100%',
  },
  badgeContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  badgeDark: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    color: '#FFFFFF',
  },
  citiesContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  separator: {
    margin: '0 8px',
    color: 'rgba(255,255,255,0.5)',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statLabel: {
    fontSize: '14px',
    opacity: 0.8,
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '600',
  },
  statDivider: {
    width: '1px',
    height: '24px',
    background: 'rgba(255,255,255,0.3)',
  },
  progressContainer: {
    padding: '24px',
    borderBottom: '1px solid #EBEBEB',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#222222',
  },
  progressPercentage: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#FF385C',
  },
  progressTrack: {
    height: '4px',
    background: '#EBEBEB',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#FF385C',
  },
  content: {
    padding: '24px',
  },
  daySection: {
    marginBottom: '24px',
    borderBottom: '1px solid #EBEBEB',
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '12px 0',
  },
  dayHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dayTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#222222',
    margin: '0 0 4px 0',
  },
  daySummary: {
    fontSize: '14px',
    color: '#717171',
    margin: 0,
  },
  activities: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    padding: '16px 0',
  },
  activityCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#F7F7F7',
    borderRadius: '12px',
  },
  activityIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#222222',
    margin: 0,
  },
  activityActions: {
    display: 'flex',
    gap: '8px',
  },
  activityBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  footer: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    borderTop: '1px solid #EBEBEB',
    background: '#F7F7F7',
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    background: '#FFFFFF',
    border: '1px solid #DDDDDD',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

export default TripModal;