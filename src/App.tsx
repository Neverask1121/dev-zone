import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import ComponentDetailPage from './pages/ComponentDetailPage';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/component/:componentId" element={<ComponentDetailPage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
