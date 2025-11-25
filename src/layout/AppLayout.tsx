import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, ShieldAlert, Settings, ArrowRightLeft, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const AppLayout: React.FC = () => {
  const { logout, user } = useAuthStore();
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Wallet, label: 'Wallet', to: '/wallet' },
    { icon: ArrowRightLeft, label: 'Payments', to: '/payments' },
    { icon: ShieldAlert, label: 'Fraud', to: '/fraud' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-10 transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-fintech-600 rounded-lg flex items-center justify-center shadow-lg shadow-fintech-600/30">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">SentinelPay</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-fintech-50 dark:bg-fintech-900/30 text-fintech-700 dark:text-fintech-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
           {/* Theme Toggle in Sidebar */}
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center gap-3 px-4 py-2 mb-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
           >
             {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
           </button>

           <div className="flex items-center gap-3 mb-4 px-2 mt-4">
              <img src={user?.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-200 ring-2 ring-white dark:ring-slate-700" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
           >
             <LogOut size={16} />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-8 transition-all duration-300">
        <Outlet />
      </main>

      {/* Mobile Top Bar (visible only on mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center z-40 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-fintech-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">SentinelPay</span>
          </div>
          <button 
             onClick={toggleTheme}
             className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex justify-between items-center z-50 pb-safe transition-colors duration-300">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'text-fintech-600 dark:text-fintech-400 bg-fintech-50 dark:bg-fintech-900/20' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'scale-110 transition-transform' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;