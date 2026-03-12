import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinned, ArrowRight, Calendar, DollarSign, 
  Bookmark, Trash2, Coffee, Zap, Flame,
  Map, Globe, Mountain, Landmark, Umbrella, Compass
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

const getCityIcon = (city) => {
  const icons = {
    'Paris': Landmark,
    'Rome': Landmark,
    'Barcelona': Umbrella,
    'Amsterdam': Compass,
    'London': Landmark,
    'Tokyo': Mountain,
    'New York': Map,
    'default': Globe
  };
  return icons[city] || icons['default'];
};

const formatBudget = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const TripCard = ({ 
  trip, 
  index, 
  isSaved, 
  onSelect, 
  onToggleSave, 
  onDelete,
  onHoverStart,
  onHoverEnd,
  isHovered,
  progress 
}) => {
  const destinations = trip.destinations || [trip.destination];
  const activitiesCount = trip.itinerary_data?.plan?.flatMap(d => d.activities).length || 0;
  const diff = getDifficultyBadge(trip.days, activitiesCount);
  const DiffIcon = diff.icon;
  const totalBudget = trip.budget || 1500;
  const CityIcon = getCityIcon(destinations[0]);
  
  // Get coordinates from trip
  const coordinates = trip.coordinates || [];
  const firstCoord = coordinates[0];
  
  // Create static map URL if coordinates exist
  const getMapUrl = () => {
    if (!firstCoord) return null;
    
    const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.warn('REACT_APP_MAPBOX_TOKEN not found in environment');
      return null;
    }
    
    // Clean up the URL - remove line breaks and spaces
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+ff385c(${firstCoord.lng},${firstCoord.lat})/${firstCoord.lng},${firstCoord.lat},12,0/600x300?access_token=${mapboxToken}`;
  };

  const mapUrl = getMapUrl();

  return (
    <motion.div 
      style={styles.card}
      onClick={() => onSelect(trip)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        y: -8, 
        boxShadow: '0 20px 30px rgba(0,0,0,0.15)',
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => onHoverStart(trip.id)}
      onHoverEnd={onHoverEnd}
    >
      {/* Map or Gradient Header */}
      <div
        style={{
          ...styles.header,
          background: mapUrl 
            ? `url(${mapUrl})` 
            : `linear-gradient(135deg, ${getCityColor(0)} 0%, ${getCityColor(1) || getCityColor(0)} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div style={styles.overlay} />
        
        {/* Map Grid Pattern (only shows on gradient, subtle on map) */}
        {!mapUrl && <div style={styles.pattern} />}
        
        {/* City Icon (only show on gradient) */}
        {!mapUrl && (
          <div style={styles.iconContainer}>
            <CityIcon size={48} color="white" strokeWidth={1.5} />
          </div>
        )}
        
        {/* Cities on header */}
        <div style={styles.citiesOverlay}>
          <div style={styles.citiesContainer}>
            {destinations.map((city, idx) => (
              <React.Fragment key={idx}>
                <span style={styles.cityText}>
                  <MapPinned size={14} color="white" />
                  {city.length > 12 ? city.substring(0, 12) + '...' : city}
                </span>
                {idx < destinations.length - 1 && (
                  <ArrowRight size={12} color="white" style={styles.arrow} />
                )}
              </React.Fragment>
            ))}
          </div>
          <motion.button 
            style={styles.saveButton}
            onClick={(e) => { e.stopPropagation(); onToggleSave(trip.id); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark size={18} color={isSaved ? "#FF385C" : "#717171"} fill={isSaved ? "#FF385C" : "none"} />
          </motion.button>
        </div>
        
        {/* Badge container */}
        <div style={styles.badgeContainer}>
          <span style={{ ...styles.badge, background: diff.bg, color: diff.color }}>
            <DiffIcon size={12} style={{ marginRight: '4px' }} /> {diff.label}
          </span>
          <span style={{ ...styles.badge, background: 'rgba(255,255,255,0.9)', color: '#222' }}>
            <Calendar size={12} style={{ marginRight: '4px' }} /> {trip.days} {trip.days === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={styles.details}>
          <div style={styles.detail}>
            <DollarSign size={14} color="#717171" />
            <span style={styles.budget}>{formatBudget(totalBudget)}</span>
          </div>
        </div>
        
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <motion.div 
              style={{ ...styles.progressFill, width: `${progress}%`, background: diff.color }} 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span style={styles.progressText}>{progress}% completed</span>
        </div>
        
        <div style={styles.footer}>
          <motion.button 
            style={styles.viewButton}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            View itinerary <ArrowRight size={14} style={{ marginLeft: '6px' }} />
          </motion.button>
          <motion.button 
            onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }} 
            style={styles.deleteButton}
            whileHover={{ scale: 1.1, color: '#FF385C' }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const styles = {
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #EBEBEB',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    position: 'relative',
    height: '160px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '16px',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
    zIndex: 1,
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 20%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 20%)',
    opacity: 0.3,
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    bottom: '50%',
    right: '16px',
    transform: 'translateY(50%)',
    opacity: 0.2,
    zIndex: 1,
  },
  citiesOverlay: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  citiesContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '4px',
  },
  cityText: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  arrow: {
    margin: '0 2px',
  },
  saveButton: {
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    display: 'flex',
    gap: '8px',
    zIndex: 2,
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  details: {
    display: 'flex',
    gap: '16px',
    marginBottom: '14px',
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#717171',
  },
  budget: {
    fontWeight: '600',
    color: '#222222',
  },
  progress: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  progressBar: {
    height: '4px',
    background: '#EBEBEB',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s',
  },
  progressText: {
    fontSize: '12px',
    color: '#717171',
    display: 'block',
    marginTop: '2px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    borderTop: '1px solid #EBEBEB',
    paddingTop: '12px',
  },
  viewButton: {
    padding: '8px 16px',
    background: '#F7F7F7',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#222222',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  deleteButton: {
    padding: '8px',
    background: 'none',
    border: 'none',
    borderRadius: '8px',
    color: '#717171',
    cursor: 'pointer',
  },
};

export default TripCard;