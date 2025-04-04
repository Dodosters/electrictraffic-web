import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BusinessPage from './pages/BusinessPage';
import PersonalPage from './pages/PersonalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PartnersPage from './pages/PartnersPage';
import CompaniesPage from './pages/CompaniesPage';
import FaqPage from './pages/FaqPage';
import NewsPage from './pages/NewsPage';
import HourlyConsumptionPage from './pages/HourlyConsumptionPage';
import AiAssistantPage from './pages/AiAssistantPage';
import './App.css';
import './styles/ButtonOverride.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ur" element={<BusinessPage />} />
            <Route path="/fiz" element={<PersonalPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/data_api" element={<PartnersPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/hourly" element={<HourlyConsumptionPage />} />
            <Route path="/ai-assistant" element={<AiAssistantPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
