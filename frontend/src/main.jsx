import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css'
import App from './App.jsx'
import Publisher from './Publisher';
import Viewer from './Viewer.jsx';
import HomePage from './HomePage.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/publisher/:streamId" element={<Publisher />} />
      <Route path="/viewer/:publisherId" element={<Viewer />} />
    </Routes>
  </BrowserRouter>
)
