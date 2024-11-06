import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.ts'; // Import persistor
import { Toaster } from 'sonner';
import { PersistGate } from 'redux-persist/es/integration/react';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster richColors position='top-center' />
        <App />
      </PersistGate>
    </Provider>
  // </StrictMode>,
);
