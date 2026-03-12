import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, MapPinned, Plus, X, Calendar, 
  Sparkles, DollarSign, Shuffle 
} from 'lucide-react';

const getCityColor = (index) => {
  const colors = ['#FF385C', '#FFA500', '#00A699', '#FC642D', '#484848'];
  return colors[index % colors.length];
};

const Planner = ({ 
  cities, 
  days, 
  mood, 
  budgetAmount, 
  loading, 
  showSurprise,
  onCityChange, 
  onAddCity, 
  onRemoveCity, 
  onDaysChange, 
  onMoodChange, 
  onBudgetChange, 
  onGenerate,
  onSurprise,
  isMobile
}) => {
  const styles = {
  section: {
    marginBottom: '48px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#222222',
    margin: 0,
  },
  surpriseButton: {
    padding: '12px 24px',
    background: '#F7F7F7',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#FF385C',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  surpriseMessage: {
    background: '#FF385C',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  card: {
    background: '#F7F7F7',
    borderRadius: '16px',
    padding: '24px',

  },
  cities: {
    marginBottom: '20px',
  },
  cityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  cityIcon: {
    flexShrink: 0,
  },
  cityInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #DDDDDD',
    fontSize: '16px',
    outline: 'none',
    background: '#FFFFFF',
  },
  removeButton: {
    padding: '8px',
    background: '#FFFFFF',
    border: '1px solid #DDDDDD',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#717171',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    padding: '8px 16px',
    background: 'none',
    border: '1px dashed #DDDDDD',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#FF385C',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },
  row: {
   display: 'grid',
  // 1 column on mobile, 3 columns on desktop
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', 
  gap: '16px',
  marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#222222',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #DDDDDD',
    fontSize: '16px',
    outline: 'none',
    background: '#FFFFFF',
    boxSizing: 'border-box', 
    height: '48px',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #DDDDDD',
    fontSize: '16px',
    outline: 'none',
    background: '#FFFFFF',
    cursor: 'pointer',
  },
  generateButton: {
    width: '100%',
    padding: '16px',
    background: '#FF385C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
};
  return (
    <motion.div 
      style={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div style={styles.header}>
        <h2 style={styles.title}>Plan new adventure</h2>
        <motion.button 
          onClick={onSurprise}
          style={styles.surpriseButton}
          whileHover={{ scale: 1.05, background: '#FF385C', color: 'white' }}
          whileTap={{ scale: 0.95 }}
        >
          <Shuffle size={18} />
          Surprise Me
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showSurprise && (
          <motion.div
            style={styles.surpriseMessage}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            ✨ Surprise! How about {cities[0]} for {days} days?
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.card}>
        {/* Multi-city input */}
        <div style={styles.cities}>
          <label style={styles.label}>
            <Globe size={16} color="#FF385C" />
            Destinations
          </label>
          {cities.map((city, index) => (
            <motion.div 
              key={index} 
              style={styles.cityRow}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MapPinned size={20} color={getCityColor(index)} style={styles.cityIcon} />
              <input
                type="text"
                placeholder={`City ${index + 1} (e.g., Paris)`}
                value={city}
                onChange={(e) => onCityChange(index, e.target.value)}
                style={styles.cityInput}
              />
              {cities.length > 1 && (
                <motion.button 
                  onClick={() => onRemoveCity(index)}
                  style={styles.removeButton}
                  whileHover={{ scale: 1.1, color: '#FF385C' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              )}
            </motion.div>
          ))}
          <motion.button 
            onClick={onAddCity} 
            style={styles.addButton}
            whileHover={{ scale: 1.02, borderColor: '#FF385C' }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} /> Add another city
          </motion.button>
        </div>

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>
              <Calendar size={16} color="#FF385C" />
              Duration (days)
            </label>
            <input 
              type="number" 
              value={days} 
              onChange={onDaysChange} 
              style={styles.input} 
              min="1" 
              max="14" 
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={styles.label}>
              <Sparkles size={16} color="#FF385C" />
              Travel style
            </label>
            <select 
              value={mood} 
              onChange={onMoodChange}
              style={styles.select}
            >
              <option>🍦 Chill</option>
              <option>🚀 Adventure</option>
              <option>🎨 Culture</option>
              <option>🍱 Foodie</option>
              <option>💑 Romantic</option>
            </select>
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={styles.label}>
              <DollarSign size={16} color="#FF385C" />
              Budget (USD)
            </label>
            <input
              type="number"
              value={budgetAmount}
              onChange={onBudgetChange}
              style={styles.input}
              min="100"
              step="100"
            />
          </div>
        </div>
        
        <motion.button 
          onClick={onGenerate}
          style={styles.generateButton}
          disabled={loading || cities.filter(c => c.trim()).length === 0}
          whileHover={{ scale: 1.02, background: '#E31C5F' }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            'Creating your itinerary...'
          ) : (
            <>
              Generate AI Itinerary <Sparkles size={18} />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};



export default Planner;