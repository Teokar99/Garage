import React, { useState } from 'react';
import { Database, Trash2, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { seedDatabase, clearDatabase } from './seedDatabase';
import { exportDatabaseToCSV } from './exportDatabase';

export function DatabaseSeeder() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSeed = async () => {
    if (!confirm('This will add 50 customers with vehicles and services to the database. Continue?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await seedDatabase();
      if (response.success) {
        setResult({ type: 'success', message: 'Database seeded successfully! 50 customers with vehicles and services have been added.' });
      } else {
        setResult({ type: 'error', message: 'Failed to seed database. Check console for details.' });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'An error occurred while seeding the database.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL customers, vehicles, and services from the database. This action cannot be undone. Are you sure?')) {
      return;
    }

    if (!confirm('Are you ABSOLUTELY sure? This will permanently delete all data!')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await clearDatabase();
      if (response.success) {
        setResult({ type: 'success', message: 'Database cleared successfully! All data has been removed.' });
      } else {
        setResult({ type: 'error', message: 'Failed to clear database. Check console for details.' });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'An error occurred while clearing the database.' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await exportDatabaseToCSV();
      if (response.success) {
        setResult({ type: 'success', message: response.message });
      } else {
        setResult({ type: 'error', message: 'Failed to export database. Check console for details.' });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'An error occurred while exporting the database.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Database Tools</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Populate or clear the database with mock data</p>
          </div>
        </div>

        {result && (
          <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
            result.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {result.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{result.message}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Seed Database</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              This will add 100 mock customers to the database. Each customer will have 1-3 vehicles,
              and each vehicle will have 1-5 service records with realistic data.
            </p>
            <button
              onClick={handleSeed}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Database className="w-5 h-5" />
              <span>{loading ? 'Seeding Database...' : 'Seed Database'}</span>
            </button>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Export to CSV</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              Download all data from the database as a CSV file. This includes all customers, vehicles, and service records.
            </p>
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>{loading ? 'Exporting...' : 'Export to CSV'}</span>
            </button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Clear Database</h3>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              ⚠️ WARNING: This will permanently delete ALL customers, vehicles, and service records from the database.
              This action cannot be undone!
            </p>
            <button
              onClick={handleClear}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>{loading ? 'Clearing Database...' : 'Clear Database'}</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600 dark:text-gray-400">Processing... This may take a minute.</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Information:</h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• <strong>Seed Database:</strong> Adds 100 customers with 85-150 vehicles and 85-750 service records</li>
            <li>• <strong>Export to CSV:</strong> Downloads all current database data as a timestamped CSV file</li>
            <li>• <strong>Clear Database:</strong> Permanently deletes all customers, vehicles, and service records</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
