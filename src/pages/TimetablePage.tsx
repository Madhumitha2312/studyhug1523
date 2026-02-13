import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetablePage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [day, setDay] = useState('0');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('timetable_entries').select('*').eq('user_id', user.id).order('day_of_week').order('start_time');
    setEntries(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!user || !subject.trim()) return;
    await supabase.from('timetable_entries').insert({
      user_id: user.id, subject: subject.trim(), day_of_week: parseInt(day), start_time: startTime, end_time: endTime, location
    });
    setSubject(''); setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('timetable_entries').delete().eq('id', id);
    load();
  };

  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const todayEntries = entries.filter(e => e.day_of_week === todayIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading">Timetable 📅</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Timetable Entry</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
              <Input placeholder="Location (optional)" value={location} onChange={e => setLocation(e.target.value)} />
              <Button onClick={add} className="w-full">Add Entry</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Schedule */}
      <Card className="border-primary/30">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-heading">Today — {DAYS[todayIndex]}</CardTitle></CardHeader>
        <CardContent>
          {todayEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No classes today!</p>
          ) : (
            <div className="space-y-2">
              {todayEntries.map(e => (
                <div key={e.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{e.subject}</p>
                    <p className="text-xs text-muted-foreground">{e.start_time?.slice(0,5)} – {e.end_time?.slice(0,5)} {e.location && `· ${e.location}`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Week */}
      {DAYS.map((dayName, i) => {
        const dayEntries = entries.filter(e => e.day_of_week === i);
        if (dayEntries.length === 0) return null;
        return (
          <Card key={i}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-heading">{dayName}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dayEntries.map(e => (
                  <div key={e.id} className="flex justify-between items-center py-1">
                    <div>
                      <p className="font-medium text-sm">{e.subject}</p>
                      <p className="text-xs text-muted-foreground">{e.start_time?.slice(0,5)} – {e.end_time?.slice(0,5)} {e.location && `· ${e.location}`}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
