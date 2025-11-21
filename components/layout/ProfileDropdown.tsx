"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronRight, UserCircle2 } from 'lucide-react';
import { useAuth, authService } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function ProfileDropdown() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);

  useEffect(() => {
    // Update user from localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    }
  }, []);

  const handleProfile = () => router.push('/profile');
  const handleSettings = () => router.push('/profile');

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast.success('Signed out successfully');
      router.push('/auth/signin');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  };

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U';
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const displayEmail = user?.email ?? user?.id ?? 'user@example.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all"
        >
          <UserCircle2 className="h-6 w-6 text-white" strokeWidth={2} />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-72 glass p-0 overflow-hidden border border-white/20 dark:border-gray-700/50 shadow-2xl" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-600/20 px-4 py-4 border-b border-white/20 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur opacity-50"></div>
              <Avatar className="h-12 w-12 relative border-2 border-white dark:border-gray-800">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={displayName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                {displayName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {displayEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
            <DropdownMenuItem 
              onClick={handleProfile}
              className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">Profile</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </DropdownMenuItem>
          </motion.div>

          <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
            <DropdownMenuItem 
              onClick={handleSettings}
              className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </DropdownMenuItem>
          </motion.div>
        </div>

        <DropdownMenuSeparator className="my-0" />

        {/* Sign Out */}
        <div className="p-2">
          <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-600 dark:focus:text-red-400"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Sign out</span>
              </div>
            </DropdownMenuItem>
          </motion.div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
