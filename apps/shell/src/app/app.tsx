// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useEffect, useState, Suspense, lazy } from 'react';
import { mfeBus } from '@polyglot-mfe-mesh/event-bus';
import { MfeToast } from '@polyglot-mfe-mesh/ui-kit';
import './app.module.css';

// @ts-ignore
const ProfileMfe = lazy(() => import('profile_mfe/App'));
// @ts-ignore
const AnalyticsMfe = lazy(() => import('analytics_mfe/App'));

export function App() {
  const [toast, setToast] = useState({ open: false, title: '', message: '' });

  useEffect(() => {
    // Shell consuming the Mesh
    const sub = mfeBus.on<{ name: string }>('USER_PROFILE_UPDATED').subscribe((payload) => {
      setToast({
        open: true,
        title: 'Shell Intercepted Update',
        message: `Detected profile change to: ${payload.name}`,
      });
    });

    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="shell-container">
      <header className="shell-header">
        <h1>Polyglot MFE Mesh (Host)</h1>
        <p className="subtitle">Orchestrating state across heterogeneous React containers</p>
      </header>
      
      <main className="shell-content">
        <div className="mesh-layout">
          <section className="mfe-slot profile-slot">
            <h2>Remote Profile MFE</h2>
            <p className="badge react-18">React 18</p>
            <Suspense fallback={<div>Loading Profile...</div>}>
              <ProfileMfe />
            </Suspense>
          </section>

          <section className="mfe-slot analytics-slot">
            <h2>Remote Analytics MFE</h2>
            <p className="badge react-legacy">React Legacy (Simulation)</p>
            <Suspense fallback={<div>Loading Analytics...</div>}>
              <AnalyticsMfe />
            </Suspense>
          </section>
        </div>

        <MfeToast 
          open={toast.open} 
          onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}
          title={toast.title}
          description={toast.message}
        />
      </main>
    </div>
  );
}

export default App;
