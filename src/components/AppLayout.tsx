import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard, Timer, Calendar, GraduationCap, FileText, BookOpen,
  BarChart3, MessageCircle, Settings, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timer', icon: Timer, label: 'Study Timer' },
  { to: '/timetable', icon: Calendar, label: 'Timetable' },
  { to: '/exams', icon: GraduationCap, label: 'Exams' },
  { to: '/assignments', icon: FileText, label: 'Assignments' },
  { to: '/topics', icon: BookOpen, label: 'Topics' },
  { to: '/performance', icon: BarChart3, label: 'Performance' },
  { to: '/ai-chat', icon: MessageCircle, label: 'AI Assistant' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-foreground/20 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen flex flex-col
        bg-sidebar border-r border-sidebar-border
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-56'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className={`flex items-center gap-2 p-4 ${collapsed ? 'justify-center' : ''}`}>
          <GraduationCap className="h-7 w-7 text-sidebar-primary shrink-0" />
          {!collapsed && <span className="font-bold text-lg font-heading text-sidebar-foreground">StudyHug</span>}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }
                ${collapsed ? 'justify-center px-0' : ''}
              `}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center p-3 border-t border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center gap-2 p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-bold font-heading text-primary">StudyHug</span>
        </div>
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
