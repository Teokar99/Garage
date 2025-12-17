import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import { logError, logInfo, getErrorMessage } from '../utils/errorHandler';

/**
 * Auth Context Type
 * Defines the shape of authentication state and methods available throughout the app
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  userProfile: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Manages authentication state for the entire application
 * Handles user login, signup, profile management, and session persistence
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  /**
   * Fetch user profile from database
   * Creates a new profile if it doesn't exist
   * Includes 5-second timeout to prevent hanging requests
   */
  const fetchUserProfile = async (userId: string) => {
    try {
      logInfo('Fetching user profile for:', userId);

      /**
       * Create race between profile fetch and 5-second timeout
       * Ensures requests don't hang indefinitely
       */
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const profileQuery = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([profileQuery, timeout]) as any;

      if (error) {
        if (error.code === 'PGRST116') {
          /**
           * Profile doesn't exist for this user
           * Create a new admin profile with basic user info
           */
          logInfo('Profile not found, creating new profile');
          
          const createQuery = supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: user?.email || '',
                role: 'admin',
                full_name: user?.user_metadata?.full_name || ''
              }
            ])
            .select()
            .single();

          const { data: newProfile, error: createError } = await Promise.race([createQuery, timeout]) as any;

          if (createError) {
            throw createError;
          }
          
          setUserProfile(newProfile);
          logInfo('Profile created successfully');
        } else {
          throw error;
        }
      } else {
        setUserProfile(data);
        logInfo('Profile fetched successfully');
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      logError('Error fetching user profile', error);
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('timeout')) {
        console.error('❌ Cannot connect to Supabase. Please check:');
        console.error('   1. Your .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.error('   2. Your Supabase project is active');
        console.error('   3. CORS is configured for localhost:5173');
        
        // Don't block on connection test
        testSupabaseConnection().catch(() => {
          console.error('Connection test also failed');
        });
      }
      
      // Set a default profile to prevent blocking
      setUserProfile({
        id: userId,
        email: user?.email || '',
        role: 'admin',
        full_name: user?.user_metadata?.full_name || ''
      });
    }
  };

  /**
   * Initialize authentication on app load
   * Tests database connection, retrieves session, and sets up auth state listener
   */
  useEffect(() => {
    /**
     * Verify Supabase connection is working
     * Logs any connection issues to console
     */
    testSupabaseConnection();

    /**
     * Restore previous session if user was logged in
     */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    /**
     * Listen for authentication state changes
     * Updates state when user logs in/out or session expires
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logInfo('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        /**
         * Fetch profile asynchronously to avoid blocking UI
         * Use default profile if fetch fails
         */
        fetchUserProfile(session.user.id).catch((error) => {
          logError('Profile fetch failed, using defaults', error);
        });
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logError('Sign in error', error);
        return { error: error.message };
      }

      logInfo('Sign in successful');
      return {};
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      logError('Sign in error', error);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        logError('Sign up error', error);
        return { error: error.message };
      }

      // Create profile immediately after signup
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: email,
                full_name: fullName || '',
                role: 'admin', // First user gets admin role
              }
            ]);

          if (profileError) {
            logError('Profile creation error', profileError);
          } else {
            logInfo('Profile created successfully');
          }
        } catch (profileError) {
          logError('Profile creation error', profileError);
        }
      }

      logInfo('Sign up successful');
      return {};
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      logError('Sign up error', error);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        logError('Sign out error', error);
      } else {
        logInfo('Sign out successful');
        setUserProfile(null);
      }
    } catch (error: unknown) {
      logError('Sign out error', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    userProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};