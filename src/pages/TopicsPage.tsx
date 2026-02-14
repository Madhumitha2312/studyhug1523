import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2 } from 'lucide-react';

export default function TopicsPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [topicName, setTopicName] = useState('');

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('topics').select('*').eq('user_id', user.id).order('subject').order('created_at');
    setTopics(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!user || !subject.trim() || !topicName.trim()) return;
    await supabase.from('topics').insert({ user_id: user.id, subject: subject.trim(), topic_name: topicName.trim() });
    setTopicName('');
    setOpen(false);
    load();
  };

  const toggle = async (id: string, current: boolean) => {
    await supabase.from('topics').update({ completed: !current }).eq('id', id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('topics').delete().eq('id', id);
    load();
  };

  // Group by subject
  const grouped = topics.reduce((acc, t) => {
    if (!acc[t.subject]) acc[t.subject] = [];
    acc[t.subject].push(t);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading">Topics 📚</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Topic</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Topic</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} maxLength={100} />
              <Input placeholder="Topic name" value={topicName} onChange={e => setTopicName(e.target.value)} maxLength={200} />
              <Button onClick={add} className="w-full">Add Topic</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No topics added yet</CardContent></Card>
      ) : Object.entries(grouped).map(([sub, items]: [string, any[]]) => {
        const completed = items.filter((t: any) => t.completed).length;
        const pct = Math.round((completed / items.length) * 100);
        return (
          <Card key={sub}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-heading">{sub}</CardTitle>
                <span className="text-xs text-muted-foreground">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((t: any) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <Checkbox checked={t.completed} onCheckedChange={() => toggle(t.id, t.completed)} />
                    <span className={`flex-1 text-sm ${t.completed ? 'line-through text-muted-foreground' : ''}`}>{t.topic_name}</span>
                    <Button variant="ghost" size="sm" onClick={() => remove(t.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
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
