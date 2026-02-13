import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LogOut, Moon, Sun, User } from 'lucide-react';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(60);
  const [saving, setSaving] = useState(false);
  const [subDays, setSubDays] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('name, daily_study_goal').eq('user_id', user.id).single().then(({ data }) => {
      if (data) { setName(data.name || ''); setGoal(data.daily_study_goal || 60); }
    });
    supabase.from('subscriptions').select('current_period_end, status').eq('user_id', user.id).single().then(({ data }) => {
      if (data?.current_period_end) {
        const days = Math.ceil((new Date(data.current_period_end).getTime() - Date.now()) / 86400000);
        setSubDays(Math.max(0, days));
      }
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ name, daily_study_goal: goal }).eq('user_id', user.id);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading">Settings ⚙️</h1>

      <Card>
        <CardHeader><CardTitle className="text-sm font-heading flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Daily Study Goal (minutes)</Label>
            <Input type="number" value={goal} onChange={e => setGoal(parseInt(e.target.value) || 60)} />
          </div>
          <div className="text-sm text-muted-foreground">Email: {user?.email}</div>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-heading">Theme</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <Label>Dark Mode</Label>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-heading">Subscription</CardTitle></CardHeader>
        <CardContent>
          {subDays !== null && subDays > 0 ? (
            <p className="text-sm">Free trial: <span className="font-bold text-primary">{subDays} days remaining</span></p>
          ) : subDays === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-destructive font-medium">Your free trial has expired</p>
              <Button size="sm">Activate Subscription</Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={signOut} className="w-full">
        <LogOut className="h-4 w-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
}
