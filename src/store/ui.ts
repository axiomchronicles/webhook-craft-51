import { create } from 'zustand';

export interface UIState {
  sidebarCollapsed: boolean;
  rightDrawerOpen: boolean;
  rightDrawerContent: 'inspector' | 'settings' | null;
  theme: 'light' | 'dark' | 'system';
  environment: 'production' | 'staging' | 'development';
  
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  openRightDrawer: (content: 'inspector' | 'settings') => void;
  closeRightDrawer: () => void;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setEnvironment: (env: 'production' | 'staging' | 'development') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  rightDrawerOpen: false,
  rightDrawerContent: null,
  theme: 'dark',
  environment: 'production',

  toggleSidebar: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  
  setSidebarCollapsed: (collapsed) => set({ 
    sidebarCollapsed: collapsed 
  }),

  openRightDrawer: (content) => set({ 
    rightDrawerOpen: true, 
    rightDrawerContent: content 
  }),
  
  closeRightDrawer: () => set({ 
    rightDrawerOpen: false, 
    rightDrawerContent: null 
  }),

  setTheme: (theme) => set({ theme }),
  
  setEnvironment: (environment) => set({ environment }),
}));