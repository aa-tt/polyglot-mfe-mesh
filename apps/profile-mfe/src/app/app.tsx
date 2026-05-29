// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useState } from 'react';
import { mfeBus } from '@polyglot-mfe-mesh/event-bus';
import * as Dialog from '@radix-ui/react-dialog';
// import './app.module.css';

export function App() {
  const [name, setName] = useState('Anunay Anindya');

  const handleSave = () => {
    // Publish event to the State Mesh
    mfeBus.publish('USER_PROFILE_UPDATED', { name }, 'profile-mfe');
  };

  return (
    <div className="container">
      <h1>Profile MFE (React 18)</h1>
      <p>Current Name: <strong>{name}</strong></p>
      
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="Button">Edit Profile</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Update your name. This will emit an event to the State Mesh.
            </Dialog.Description>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="name">Name</label>
              <input 
                className="Input" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </fieldset>
            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
              <Dialog.Close asChild>
                <button className="Button green" onClick={handleSave}>Save changes</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default App;
