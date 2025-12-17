import { createClient } from '@supabase/supabase-js';
import { logError } from '../utils/errorHandler';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  console.warn('⚠️ Missing Supabase environment variables:', missingVars.join(', '));
  console.warn('Please check your .env file and ensure these variables are set.');
  console.warn('Example .env file:');
  console.warn('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.warn('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('📍 Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Not set');
    console.log('🔑 Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not set');
    
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      if (error.message.includes('Failed to fetch')) {
        console.error('💡 This usually means:');
        console.error('   1. Invalid Supabase URL or key');
        console.error('   2. CORS not configured for localhost:5173');
        console.error('   3. Supabase project is paused/inactive');
      }
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    logError('Supabase connection test failed', error);
    return false;
  }
};