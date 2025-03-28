'use client';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
import type { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { useEffect } from 'react';

export function SidebarUserNav({ user }: { user: User & { subscriptionDueDate?: string }; }) {
  const { setTheme, theme } = useTheme();



  const renderDueDate = () => {
    if (user?.subscriptionDueDate) {
      const dueDate = new Date(user.subscriptionDueDate);
      const today = new Date();

      if (dueDate > today) {
      return (
        <button
        className="dark:bg-secondary bg-primary text-white w-full py-2 px-4 rounded hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary-light my-2 text-xs"
        disabled
        >
        Subscription Active - Due Date: {dueDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        </button>
      );
      } else {
      return (
        <button
        className="bg-red-500 text-white w-full py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 my-2 text-xs"
        disabled
        >
        Subscription Expired - Due Date: {dueDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        </button>
      );
      }
    } else {
      return (
      <button
        className="dark:bg-secondary bg-primary text-white w-full py-2 px-4 rounded hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary-light my-2 text-xs"
        disabled
      >
        Not Subscribed
      </button>
      );
    }
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
     {renderDueDate()}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-500 text-white">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <span className="truncate">{user?.email}</span><br />
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  signOut({
                    redirectTo: '/',
                  });
                }}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
     
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
