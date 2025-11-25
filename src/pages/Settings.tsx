import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuthStore } from '../stores/authStore';

const Settings: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 pt-16 md:pt-8 animate-fade-in">
       <h1 className="text-2xl font-bold text-slate-900 dark:text-white animate-slide-up">Settings</h1>

       <div className="animate-slide-up [animation-delay:100ms]">
            <Card title="Profile">
                <div className="flex items-center gap-4 mb-6">
                        <img src={user?.avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 ring-4 ring-slate-50 dark:ring-slate-800" />
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                        </div>
                </div>
                <Button variant="secondary" className="w-full sm:w-auto">Edit Profile</Button>
            </Card>
       </div>

       <div className="animate-slide-up [animation-delay:200ms]">
            <Card title="Security">
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Enabled via Authenticator App</p>
                        </div>
                        <div className="h-6 w-10 bg-fintech-600 rounded-full relative cursor-pointer shadow-inner">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Login Notifications</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Alert me of new device logins</p>
                        </div>
                        <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer shadow-inner">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </Card>
       </div>

       <div className="pt-4 animate-slide-up [animation-delay:300ms]">
           <Button variant="danger" onClick={logout} className="w-full py-3">
               Log Out
           </Button>
       </div>
    </div>
  );
};

export default Settings;