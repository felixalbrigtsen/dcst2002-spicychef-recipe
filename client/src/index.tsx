import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AlertProvider from './components/Alerts';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </React.StrictMode>
);

