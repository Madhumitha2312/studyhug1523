import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

export default function StudyTimerPage() {
  const { user } = useAuth();
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [subject, setSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('subjects').select('id, name').eq('user_id', user.id).then(({ data }) => setSubjects(data || []));
    supabase.from('study_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => setSessions(data || []));
  }, [user]);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const start = () => { startTimeRef.current = new Date(); setRunning(true); };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setSeconds(0); };

  const stop = async () => {
    setRunning(false);
    if (!user || seconds < 10) return;
    const duration = Math.floor(seconds / 60);
    const subjectId = subject || undefined;
    await supabase.from('study_sessions').insert({
      user_id: user.id,
      subject_id: subjectId !== '' ? subjectId : null,
      duration,
      started_at: startTimeRef.current?.toISOString(),
      ended_at: new Date().toISOString(),
    });

    // Update streak
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data: existing } = await supabase.from('study_streaks')
      .select('*').eq('user_id', user.id).eq('streak_date', today).single();
    if (!existing) {
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
      const { data: prev } = await supabase.from('study_streaks')
        .select('streak_count').eq('user_id', user.id).eq('streak_date', yesterday).single();
      await supabase.from('study_streaks').insert({
        user_id: user.id,
        streak_date: today,
        streak_count: (prev?.streak_count || 0) + 1,
      });
    }

    setSeconds(0);
    const { data } = await supabase.from('study_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
    setSessions(data || []);
  };

  const addSubject = async () => {
    if (!user || !newSubject.trim()) return;
    const { data } = await supabase.from('subjects').insert({ user_id: user.id, name: newSubject.trim() }).select().single();
    if (data) {
      setSubjects(prev => [...prev, data]);
      setSubject(data.id);
      setNewSubject('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-heading">Study Timer ⏱️</h1>

      <Card>
        <CardContent className="pt-6 text-center space-y-6">
          <div className="text-7xl font-mono font-bold text-foreground tracking-wider">
            {formatTime(seconds)}
          </div>

          <div className="flex items-center gap-2 max-w-xs mx-auto">
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 max-w-xs mx-auto">
            <Input placeholder="New subject" value={newSubject} onChange={e => setNewSubject(e.target.value)} maxLength={100} />
            <Button variant="outline" size="sm" onClick={addSubject}>Add</Button>
          </div>

          <div className="flex justify-center gap-3">
            {!running ? (
              <Button size="lg" onClick={start}><Play className="h-5 w-5 mr-1" /> {seconds > 0 ? 'Resume' : 'Start'}</Button>
            ) : (
              <Button size="lg" variant="secondary" onClick={pause}><Pause className="h-5 w-5 mr-1" /> Pause</Button>
            )}
            <Button size="lg" variant="destructive" onClick={stop} disabled={seconds < 10}>
              <Square className="h-5 w-5 mr-1" /> Save
            </Button>
            <Button size="lg" variant="outline" onClick={reset}><RotateCcw className="h-5 w-5" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-heading">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions yet. Start studying!</p>
          ) : (
            <div className="space-y-2">
              {sessions.map(s => (
                <div key={s.id} className="flex justify-between text-sm border-b border-border py-2 last:border-0">
                  <span>{format(new Date(s.created_at), 'MMM d, h:mm a')}</span>
                  <span className="font-medium">{s.duration} min</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
