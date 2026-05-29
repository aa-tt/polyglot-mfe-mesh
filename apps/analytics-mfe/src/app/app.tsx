// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useEffect, useState } from 'react';
import { mfeBus } from '@polyglot-mfe-mesh/event-bus';
// import './app.module.css';

/**
 * Analytics MFE (Simulating a Legacy/Different Context)
 */
export function App() {
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    // Subscriber to the Mesh
    const sub = mfeBus.on<{ name: string }>('USER_PROFILE_UPDATED').subscribe((payload) => {
      setUpdateCount((prev) => prev + 1);
      setLastUpdate(new Date().toLocaleTimeString());
      console.log('Analytics MFE received update for:', payload.name);
    });

    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="analytics-container">
      <h3>Analytics MFE (Polyglot Consumer)</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Syncs</span>
          <span className="stat-value">{updateCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Last Ping</span>
          <span className="stat-value">{lastUpdate || 'Waiting...'}</span>
        </div>
      </div>
      <p className="description">
        I am reacting to events from the <strong>Profile MFE</strong> 
        without a shared React Context.
      </p>
    </div>
  );
}

export default App;
