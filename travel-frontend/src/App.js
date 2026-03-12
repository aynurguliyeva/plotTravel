import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from './api';
import Header from './components/Header';
import Planner from './components/Planner';
import TripCard from './components/TripCard';
import TripModal from './components/TripModal';
import Landing from './pages/Landing';
import Auth from './pages/Auth';

function App() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  const styles = {
    appContainer: {
      minHeight: '100vh',
      background: '#FFFFFF',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    appMain: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: isMobile ? '20px' : '40px 60px',
    },
    sectionTitle: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#222222',
    },
    tripsSection: {
      marginTop: '40px',
    },
    tripsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile
        ? '1fr'
        : (isTablet ? '1fr 1fr' : 'repeat(3, 1fr)'),
      gap: '24px',
    },
    emptyState: {
      gridColumn: isMobile ? '1' : 'span 3',
      textAlign: 'center',
      padding: '80px 0',
    },
    emptyStateText: {
      fontSize: '16px',
      color: '#717171',
    },
  };

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState(token ? 'dashboard' : 'landing');
  const [activeTab, setActiveTab] = useState('my-trips');
  const [trips, setTrips] = useState([]);

  const [cities, setCities] = useState(['']);
  const [days, setDays] = useState(3);
  const [mood, setMood] = useState('🍦 Chill');
  const [budgetAmount, setBudgetAmount] = useState(1500);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [checkedActivities, setCheckedActivities] = useState(() =>
    JSON.parse(localStorage.getItem('checkedActivities') || '{}')
  );

  const [favoriteActivities, setFavoriteActivities] = useState(() =>
    JSON.parse(localStorage.getItem('favoriteActivities') || '{}')
  );

  const [savedTrips, setSavedTrips] = useState(() =>
    JSON.parse(localStorage.getItem('savedTrips') || '[]')
  );

  const [completedTripIds, setCompletedTripIds] = useState(() =>
    JSON.parse(localStorage.getItem('completedTrips') || '[]')
  );

  const [showSurprise, setShowSurprise] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (token) fetchTrips();
  }, [token]);

  useEffect(() => {
    localStorage.setItem('checkedActivities', JSON.stringify(checkedActivities));
    localStorage.setItem('favoriteActivities', JSON.stringify(favoriteActivities));
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
    localStorage.setItem('completedTrips', JSON.stringify(completedTripIds));
  }, [checkedActivities, favoriteActivities, savedTrips, completedTripIds]);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips/');
      setTrips(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const deleteTrip = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t.id !== id));
      setCompletedTripIds(prev => prev.filter(t => t !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
    } catch (err) {
      alert("Could not delete trip.");
    }
  };

  const handleAuth = async (email, password, isRegistering) => {
    setLoading(true);
    try {
      if (isRegistering) {
        await api.post('/users/register', { email, password });
        alert("Account created successfully! ✨");
      } else {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const res = await api.post('/users/login', formData);

        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
        setEmail(email);
        setView('dashboard');
      }
    } catch {
      alert("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const addCity = () => setCities([...cities, '']);

  const removeCity = (index) => {
    if (cities.length > 1) {
      setCities(cities.filter((_, i) => i !== index));
    }
  };

  const updateCity = (index, value) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
  };

  const getTripProgress = (trip) => {

    if (!trip.itinerary_data?.plan) return 0;

    const allActivities = [];

    trip.itinerary_data.plan.forEach((day, dayIdx) => {
      day.activities.forEach((act, actIdx) => {
        allActivities.push(`${trip.id}-day${dayIdx}-act${actIdx}`);
      });
    });

    if (allActivities.length === 0) return 0;

    const doneCount = allActivities.filter(key => checkedActivities[key]).length;
    const progress = Math.round((doneCount / allActivities.length) * 100);

    if (progress === 100 && !completedTripIds.includes(trip.id)) {
      setCompletedTripIds(prev => [...prev, trip.id]);
    }

    return progress;
  };

  const getTotalBudget = (trip) => {
    if (trip.itinerary_data?.preferences && trip.itinerary_data.preferences.length > 1) {
      const budgetString = trip.itinerary_data.preferences[1];
      const match = budgetString.match(/\$(\d+)/);
      if (match) return parseInt(match[1]);
    }
    return 1500;
  };

  const activeTrips = trips.filter(t => !completedTripIds.includes(t.id));
  const completedTrips = trips.filter(t => completedTripIds.includes(t.id));

  const toggleSaveTrip = (tripId) => {
    setSavedTrips(prev =>
      prev.includes(tripId)
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

  const toggleFavoriteActivity = (activityKey) => {
    setFavoriteActivities(prev => ({
      ...prev,
      [activityKey]: !prev[activityKey]
    }));
  };

  const generateItinerary = async () => {

    const validCities = cities.filter(c => c.trim() !== '');

    if (validCities.length === 0) {
      alert("Please add at least one city");
      return;
    }

    setLoading(true);

    try {

      const budgetString = `$${budgetAmount} USD`;

      await api.post('/ai/itinerary', {
        destinations: validCities,
        days: Number(days),
        preferences: [mood, budgetString]
      });

      setCities(['']);
      fetchTrips();

      alert("Itinerary created successfully! ✨");

    } catch {
      alert("Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };

  const surpriseMe = () => {

    const surpriseDestinations = ['Paris', 'Tokyo', 'Barcelona', 'Amsterdam', 'Rome', 'New York'];

    const randomDest = surpriseDestinations[Math.floor(Math.random() * surpriseDestinations.length)];
    const randomDays = Math.floor(Math.random() * 7) + 3;
    const randomBudget = (Math.floor(Math.random() * 10) + 5) * 200;

    const moods = ['🍦 Chill', '🚀 Adventure', '🎨 Culture', '🍱 Foodie'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    setCities([randomDest]);
    setDays(randomDays);
    setMood(randomMood);
    setBudgetAmount(randomBudget);

    setShowSurprise(true);

    setTimeout(() => setShowSurprise(false), 2000);
  };

  const parseDestinations = (trip) => {

    if (trip.destinations && Array.isArray(trip.destinations)) {
      return trip.destinations;
    }

    if (trip.destination && trip.destination.includes(' → ')) {
      return trip.destination.split(' → ').map(city => city.trim());
    }

    return [trip.destination || 'Unknown'];
  };

  if (view === 'landing') {
    return <Landing onGetStarted={() => setView('auth')} isMobile={isMobile} />;
  }

  if (view === 'auth') {
    return <Auth onAuth={handleAuth} loading={loading} />;
  }

  return (
    <div style={styles.appContainer}>

      <Header
        email={email}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTrips={activeTrips}
        completedTrips={completedTrips}
        onLogout={handleLogout}
        onLogoClick={() => setView('landing')}
      />

      <main style={styles.appMain}>

        {activeTab === 'my-trips' && (
          <Planner
            cities={cities}
            days={days}
            mood={mood}
            budgetAmount={budgetAmount}
            loading={loading}
            showSurprise={showSurprise}
            onCityChange={updateCity}
            onAddCity={addCity}
            onRemoveCity={removeCity}
            onDaysChange={(e) => setDays(e.target.value)}
            onMoodChange={(e) => setMood(e.target.value)}
            onBudgetChange={(e) => setBudgetAmount(Number(e.target.value))}
            onGenerate={generateItinerary}
            onSurprise={surpriseMe}
            isMobile={isMobile}
          />
        )}

        <div style={styles.tripsSection}>

          <h2 style={styles.sectionTitle}>
            {activeTab === 'my-trips'
              ? 'Your active trips'
              : 'Completed adventures'}
          </h2>

          <div style={styles.tripsGrid}>

            {(activeTab === 'my-trips' ? activeTrips : completedTrips).length === 0 ? (

              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>
                  {activeTab === 'my-trips'
                    ? 'No active trips. Start planning your next adventure!'
                    : 'No completed trips yet. Keep exploring!'}
                </p>
              </div>

            ) : (

              (activeTab === 'my-trips' ? activeTrips : completedTrips).map((trip, index) => {

                const progress = getTripProgress(trip);
                const isSaved = savedTrips.includes(trip.id);
                const destinations = parseDestinations(trip);

                const tripWithMeta = {
                  ...trip,
                  destinations,
                  budget: getTotalBudget(trip),
                  progress
                };

                return (
                  <TripCard
                    key={trip.id}
                    trip={tripWithMeta}
                    index={index}
                    isSaved={isSaved}
                    onSelect={setSelectedTrip}
                    onToggleSave={toggleSaveTrip}
                    onDelete={deleteTrip}
                    onHoverStart={setHoveredCard}
                    onHoverEnd={() => setHoveredCard(null)}
                    isHovered={hoveredCard === trip.id}
                    progress={progress}
                  />
                );
              })
            )}

          </div>
        </div>

      </main>

      <AnimatePresence>

        {selectedTrip && (
          <TripModal
            trip={selectedTrip}
            isSaved={savedTrips.includes(selectedTrip.id)}
            onClose={() => setSelectedTrip(null)}
            onToggleSave={toggleSaveTrip}
            onToggleActivity={(key) =>
              setCheckedActivities(prev => ({ ...prev, [key]: !prev[key] }))
            }
            onToggleFavorite={toggleFavoriteActivity}
            checkedActivities={checkedActivities}
            favoriteActivities={favoriteActivities}
          />
        )}

      </AnimatePresence>

    </div>
  );
}

export default App;