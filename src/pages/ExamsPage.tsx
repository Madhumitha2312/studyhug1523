import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export default function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [notes, setNotes] = useState('');

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('exams').select('*').eq('user_id', user.id).order('exam_date');
    setExams(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!user || !name.trim() || !examDate) return;
    await supabase.from('exams').insert({ user_id: user.id, name: name.trim(), subject, exam_date: examDate, notes });
    setName(''); setSubject(''); setExamDate(''); setNotes('');
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('exams').delete().eq('id', id);
    load();
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'border-l-4 border-l-destructive';
    if (days <= 7) return 'border-l-4 border-l-warning';
    return 'border-l-4 border-l-accent';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading">Exams 🎓</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Exam</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Exam</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Exam name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
              <Input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} />
              <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
              <Button onClick={add} className="w-full">Add Exam</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {exams.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No exams added yet</CardContent></Card>
        ) : exams.map(exam => {
          const days = differenceInDays(new Date(exam.exam_date), new Date());
          const isPast = days < 0;
          return (
            <Card key={exam.id} className={`${isPast ? 'opacity-50' : getUrgencyColor(days)}`}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {exam.name}</p>
                  <div className="text-sm text-muted-foreground">
                    {exam.subject && <span>{exam.subject} · </span>}
                    <span>{format(new Date(exam.exam_date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${isPast ? '' : days <= 3 ? 'text-destructive' : days <= 7 ? 'text-warning' : 'text-accent'}`}>
                    {isPast ? 'Done' : `${days}d`}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => remove(exam.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
