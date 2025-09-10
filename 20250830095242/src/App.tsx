import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import KnowledgeManager from './pages/KnowledgeManager';
import ResearchAssistant from './pages/ResearchAssistant';
import AIGardener from './pages/AIGardener';
import Welcome from './pages/Welcome';
import UserGuide from './pages/UserGuide';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="app-layout min-h-screen bg-white dark:bg-dark-bg-primary text-gray-900 dark:text-dark-text-primary">
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="knowledge" element={<KnowledgeManager />} />
            <Route path="research" element={<ResearchAssistant />} />
            <Route path="teaching" element={<AIGardener />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;