import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import ComponentDetailPage from './pages/ComponentDetailPage';
import ResponsiveMultiLevelNavigation from './components/ResponsiveMultiLevelNavigation';
import NotFound from './components/NotFound';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/component/:componentId" element={<ComponentDetailPage />} />
        </Route>
        <Route path="/navigation" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/dashboard" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/workspace/*" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/reports/*" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="/support/*" element={<ResponsiveMultiLevelNavigation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProvider>
  );
}
