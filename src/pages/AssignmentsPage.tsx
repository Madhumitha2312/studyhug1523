import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('assignments').select('*').eq('user_id', user.id).order('due_date');
    setAssignments(data || []);
  };

  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!user || !title.trim()) return;
    await supabase.from('assignments').insert({
      user_id: user.id, title: title.trim(), subject, due_date: dueDate || null, description
    });
    setTitle(''); setSubject(''); setDueDate(''); setDescription('');
    setOpen(false);
    load();
  };

  const toggle = async (id: string, current: string) => {
    await supabase.from('assignments').update({ status: current === 'completed' ? 'pending' : 'completed' }).eq('id', id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('assignments').delete().eq('id', id);
    load();
  };

  const filtered = assignments.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading">Assignments 📝</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Assignment</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
              <Button onClick={add} className="w-full">Add Assignment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'completed'].map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No assignments found</CardContent></Card>
        ) : filtered.map(a => (
          <Card key={a.id} className={a.status === 'completed' ? 'opacity-60' : ''}>
            <CardContent className="py-3 flex items-center gap-3">
              <Checkbox checked={a.status === 'completed'} onCheckedChange={() => toggle(a.id, a.status)} />
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${a.status === 'completed' ? 'line-through' : ''}`}>{a.title}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {a.subject && <span>{a.subject}</span>}
                  {a.due_date && <span>Due: {format(new Date(a.due_date), 'MMM d')}</span>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
