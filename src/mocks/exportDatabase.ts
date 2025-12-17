import { supabase } from '../lib/supabase';

export async function exportDatabaseToCSV() {
  try {
    const [customersResult, vehiclesResult, servicesResult] = await Promise.all([
      supabase.from('customers').select('*').order('created_at', { ascending: true }),
      supabase.from('vehicles').select('*').order('created_at', { ascending: true }),
      supabase.from('service_records').select('*').order('date', { ascending: true })
    ]);

    if (customersResult.error) throw customersResult.error;
    if (vehiclesResult.error) throw vehiclesResult.error;
    if (servicesResult.error) throw servicesResult.error;

    const customers = customersResult.data || [];
    const vehicles = vehiclesResult.data || [];
    const services = servicesResult.data || [];

    const csvContent = generateCSV(customers, vehicles, services);
    downloadCSV(csvContent);

    return {
      success: true,
      message: `Exported ${customers.length} customers, ${vehicles.length} vehicles, and ${services.length} service records.`
    };
  } catch (error) {
    console.error('Error exporting database:', error);
    return { success: false, message: 'Failed to export database' };
  }
}

function generateCSV(customers: any[], vehicles: any[], services: any[]) {
  let csv = '';

  csv += '=== CUSTOMERS ===\n';
  if (customers.length > 0) {
    const customerHeaders = Object.keys(customers[0]).join(',');
    csv += customerHeaders + '\n';
    customers.forEach(customer => {
      const row = Object.values(customer).map(val =>
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',');
      csv += row + '\n';
    });
  }

  csv += '\n=== VEHICLES ===\n';
  if (vehicles.length > 0) {
    const vehicleHeaders = Object.keys(vehicles[0]).join(',');
    csv += vehicleHeaders + '\n';
    vehicles.forEach(vehicle => {
      const row = Object.values(vehicle).map(val =>
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',');
      csv += row + '\n';
    });
  }

  csv += '\n=== SERVICE RECORDS ===\n';
  if (services.length > 0) {
    const serviceHeaders = Object.keys(services[0]).join(',');
    csv += serviceHeaders + '\n';
    services.forEach(service => {
      const row = Object.values(service).map(val => {
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
        if (typeof val === 'object' && val !== null) return `"${JSON.stringify(val)}"`;
        return val;
      }).join(',');
      csv += row + '\n';
    });
  }

  return csv;
}

function downloadCSV(csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.setAttribute('href', url);
  link.setAttribute('download', `autoshop_database_export_${timestamp}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
