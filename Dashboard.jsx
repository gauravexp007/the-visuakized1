import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PDFAnalyzer from './pages/PDFAnalyzer';
import VisualInsights from './pages/VisualInsights';
import EmailAssistant from './pages/EmailAssistant';
import Chatbot from './pages/Chatbot';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/pdf"       element={<PDFAnalyzer />} />
            <Route path="/insights"  element={<VisualInsights />} />
            <Route path="/email"     element={<EmailAssistant />} />
            <Route path="/chatbot"   element={<Chatbot />} />
            <Route path="/settings"  element={<Settings />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}
