import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getDailyQuote } from '@/lib/quotes';
import { studyPets, getPetStage, getPetMood } from '@/lib/study-pets';
import { Clock, Flame, BookOpen, FileText, GraduationCap, Droplets, Quote } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Profile {
  name: string;
  daily_study_goal: number;
  study_pet: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [waterCount, setWaterCount] = useState(0);
  const quote = getDailyQuote();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: prof } = await supabase.from('profiles').select('name, daily_study_goal, study_pet').eq('user_id', user.id).single();
      if (prof) setProfile(prof);

      const today = format(new Date(), 'yyyy-MM-dd');

      const { data: sessions } = await supabase.from('study_sessions').select('duration').eq('user_id', user.id).gte('started_at', today);
      setTodayMinutes((sessions || []).reduce((sum, s) => sum + (s.duration || 0), 0));

      const { data: streak } = await supabase.from('study_streaks').select('streak_count').eq('user_id', user.id).eq('streak_date', today).single();
      setStreakCount(streak?.streak_count || 0);

      const { count: tc } = await supabase.from('assignments').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending');
      setTaskCount(tc || 0);

      const { count: ac } = await supabase.from('assignments').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      setAssignmentCount(ac || 0);

      const { data: exams } = await supabase.from('exams').select('*').eq('user_id', user.id).gte('exam_date', today).order('exam_date').limit(3);
      setUpcomingExams(exams || []);

      const { count: wc } = await supabase.from('water_log').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('logged_at', today);
      setWaterCount(wc || 0);
    };
    load();
  }, [user]);

  const pet = studyPets.find(p => p.id === (profile?.study_pet || 'cat')) || studyPets[0];
  const petStage = getPetStage(todayMinutes);
  const goalProgress = profile ? Math.min(100, (todayMinutes / profile.daily_study_goal) * 100) : 0;

  const addWater = async () => {
    if (!user) return;
    await supabase.from('water_log').insert({ user_id: user.id, amount_ml: 250 });
    setWaterCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">
          Hello, {profile?.name || 'Student'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Ready to make today count?</p>
      </div>

      {/* Quote */}
      <Card className="glass-card border-primary/20">
        <CardContent className="py-4 flex gap-3 items-start">
          <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="italic text-foreground">"{quote.text}"</p>
            <p className="text-sm text-muted-foreground mt-1">— {quote.author}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-primary mb-1" />
            <div className="text-2xl font-bold">{todayMinutes}</div>
            <div className="text-xs text-muted-foreground">Minutes Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Flame className="h-6 w-6 mx-auto text-destructive mb-1" />
            <div className="text-2xl font-bold">{streakCount}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <FileText className="h-6 w-6 mx-auto text-info mb-1" />
            <div className="text-2xl font-bold">{taskCount}</div>
            <div className="text-xs text-muted-foreground">Pending Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Droplets className="h-6 w-6 mx-auto text-info mb-1" />
            <div className="text-2xl font-bold">{waterCount}</div>
            <div className="text-xs text-muted-foreground">Glasses Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Study Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-heading">Today's Study Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={goalProgress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {todayMinutes} / {profile?.daily_study_goal || 60} minutes
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Study Pet */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Your Study Pet</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-6xl animate-float mb-2">{pet.stages[petStage]}</div>
            <p className="font-medium">{pet.name}</p>
            <p className="text-sm text-muted-foreground">{getPetMood(todayMinutes > 0, streakCount)}</p>
            <button onClick={addWater} className="mt-3 text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
              <Droplets className="h-4 w-4" /> Give water (+1 glass)
            </button>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading flex items-center gap-1">
              <GraduationCap className="h-4 w-4" /> Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming exams 🎉</p>
            ) : (
              <div className="space-y-2">
                {upcomingExams.map(exam => {
                  const days = differenceInDays(new Date(exam.exam_date), new Date());
                  return (
                    <div key={exam.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{exam.name}</p>
                        <p className="text-muted-foreground">{exam.subject}</p>
                      </div>
                      <span className={`font-bold ${days <= 3 ? 'text-destructive' : days <= 7 ? 'text-warning' : 'text-accent'}`}>
                        {days}d
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
