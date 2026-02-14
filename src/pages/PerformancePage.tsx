import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PerformancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');
  const [testName, setTestName] = useState('');

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from('performance_records').select('*').eq('user_id', user.id).order('record_date', { ascending: false });
    setRecords(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const add = async () => {
    if (!user || !subject.trim() || !marks) return;
    await supabase.from('performance_records').insert({
      user_id: user.id, subject: subject.trim(), marks: parseFloat(marks), total_marks: parseFloat(totalMarks) || 100, test_name: testName
    });
    setSubject(''); setMarks(''); setTotalMarks('100'); setTestName('');
    setOpen(false);
    load();
  };

  // Subject averages
  const averages = records.reduce((acc, r) => {
    if (!acc[r.subject]) acc[r.subject] = { total: 0, count: 0, totalMarks: 0 };
    acc[r.subject].total += Number(r.marks);
    acc[r.subject].totalMarks += Number(r.total_marks);
    acc[r.subject].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; totalMarks: number }>);

  const subjectList = Object.entries(averages).map(([sub, data]: [string, any]) => ({
    subject: sub,
    avg: Math.round((data.total / data.totalMarks) * 100),
    count: data.count,
  })).sort((a, b) => a.avg - b.avg);

  const weakSubjects = subjectList.filter(s => s.avg < 50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading">Performance 📊</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Add Marks</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Performance Record</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} maxLength={100} />
              <Input placeholder="Test name (optional)" value={testName} onChange={e => setTestName(e.target.value)} maxLength={200} />
              <div className="flex gap-2">
                <Input type="number" placeholder="Marks" value={marks} onChange={e => setMarks(e.target.value)} min={0} max={10000} />
                <span className="flex items-center text-muted-foreground">/</span>
                <Input type="number" placeholder="Total" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} min={1} max={10000} />
              </div>
              <Button onClick={add} className="w-full">Add Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {weakSubjects.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading text-destructive flex items-center gap-1">
              <TrendingDown className="h-4 w-4" /> Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {weakSubjects.map(s => (
                <span key={s.subject} className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive">{s.subject} ({s.avg}%)</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {subjectList.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-heading">Subject Averages</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {subjectList.map(s => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{s.subject}</span>
                  <span className={s.avg >= 70 ? 'text-accent' : s.avg >= 50 ? 'text-warning' : 'text-destructive'}>{s.avg}%</span>
                </div>
                <Progress value={s.avg} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-heading">Recent Records</CardTitle></CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-sm text-muted-foreground">No records yet</p>
          ) : (
            <div className="space-y-2">
              {records.slice(0, 15).map(r => (
                <div key={r.id} className="flex justify-between text-sm border-b border-border py-2 last:border-0">
                  <div>
                    <span className="font-medium">{r.subject}</span>
                    {r.test_name && <span className="text-muted-foreground"> · {r.test_name}</span>}
                  </div>
                  <span className="font-medium">{Number(r.marks)}/{Number(r.total_marks)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
