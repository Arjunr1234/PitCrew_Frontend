
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.ts'; // Import persistor
import { Toaster } from 'sonner';
import { PersistGate } from 'redux-persist/es/integration/react';
import { SocketProvider } from './Context/SocketIO.tsx';

createRoot(document.getElementById('root')!).render(
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster richColors position='top-center' />
          <SocketProvider>
            <App />
          </SocketProvider>
      </PersistGate>
    </Provider>
  
);
