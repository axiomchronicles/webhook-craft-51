import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'viewer';
  avatar?: string;
  organizationId: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      // Set up auth state listener
      supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.email || '',
              role: (profile?.role as 'admin' | 'developer' | 'viewer') || 'developer',
              avatar: profile?.avatar || undefined,
              organizationId: profile?.organization_id || '',
            };

            set({
              user,
              session,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }
      );

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: profile?.name || session.user.email || '',
          role: (profile?.role as 'admin' | 'developer' | 'viewer') || 'developer',
          avatar: profile?.avatar || undefined,
          organizationId: profile?.organization_id || '',
        };

        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      isAuthenticated: false,
    });
  },
}));