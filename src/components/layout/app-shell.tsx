import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { useAuthStore } from '@/store/auth';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { RightDrawer } from './right-drawer';
import { ChatBot } from '@/components/ui/chat-bot';

export function AppShell() {
  const { sidebarCollapsed } = useUIStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Layout Grid */}
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navigation */}
          <TopBar />
          
          {/* Page Content */}
          <motion.main
            className="flex-1 overflow-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="h-full">
              <Outlet />
            </div>
          </motion.main>
        </div>

        {/* Right Drawer */}
        <RightDrawer />
      </div>

      {/* Floating Chat Bot */}
      <ChatBot />
    </div>
  );
}