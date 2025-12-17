import React, { useState } from 'react';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CustomersPage } from './pages/CustomersPage';
import { ServicesPage } from './pages/ServicesPage';
import { UsersPage } from './pages/UsersPage';
import { DatabaseSeeder } from './mocks/DatabaseSeeder';
import { AdminRevenuePage } from './pages/AdminRevenuePage';

/**
 * AppContent Component
 * Main application router handling navigation between different pages
 * Manages page state and URL synchronization for browser history
 */
function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/customers') return 'customers';
    if (path === '/services') return 'services';
    if (path === '/users') return 'users';
    if (path === '/database') return 'database';
    if (path === '/revenue') return 'revenue';
    return 'dashboard';
  });
  const [pageData, setPageData] = useState<any>(null);

  /**
   * Handle browser back/forward navigation
   * Updates current page state when user uses browser navigation
   */
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/customers') setCurrentPage('customers');
      else if (path === '/services') setCurrentPage('services');
      else if (path === '/users') setCurrentPage('users');
      else if (path === '/database') setCurrentPage('database');
      else if (path === '/revenue') setCurrentPage('revenue');
      else setCurrentPage('dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  /**
   * Navigate to a different page and update URL
   * Uses History API to update URL without full page reload
   */
  const navigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);

    const url = page === 'dashboard' ? '/' : `/${page}`;
    window.history.pushState(null, '', url);
  };

  /**
   * Render the appropriate page component based on current page state
   * Each case corresponds to a different feature section of the app
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'customers':
        return <CustomersPage onNavigate={navigate} />;
      case 'services':
        return <ServicesPage />;
      case 'users':
        return <UsersPage />;
      case 'database':
        return <DatabaseSeeder />;
      case 'revenue':
        return <AdminRevenuePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;