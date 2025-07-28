import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SectionProvider } from './context/section'; 
import { SearchProvider } from './context/search';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
      <SectionProvider>
        <App />
      </SectionProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
