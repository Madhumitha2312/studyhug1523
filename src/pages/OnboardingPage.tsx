import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { studyPets } from '@/lib/study-pets';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = ['name', 'goal', 'pet'] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(60);
  const [pet, setPet] = useState('cat');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({
      name,
      daily_study_goal: goal,
      study_pet: pet,
      onboarding_completed: true,
    }).eq('user_id', user.id);
    setSaving(false);
    navigate('/');
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleFinish();
  };
  const back = () => step > 0 && setStep(step - 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-3xl font-bold font-heading">Welcome to StudyHug!</h1>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, i) => (
              <div key={i} className={`h-2 w-12 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">
              {step === 0 && "What's your name?"}
              {step === 1 && "Set your daily study goal"}
              {step === 2 && "Choose your study pet!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 0 && (
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg"
                autoFocus
              />
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={15}
                    max={480}
                    value={goal}
                    onChange={(e) => setGoal(parseInt(e.target.value) || 60)}
                    className="text-lg w-24"
                  />
                  <span className="text-muted-foreground">minutes per day</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[30, 60, 90, 120].map(g => (
                    <Button
                      key={g}
                      variant={goal === g ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setGoal(g)}
                    >
                      {g} min
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-3 gap-3">
                {studyPets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPet(p.id)}
                    className={`p-4 rounded-lg border-2 text-center transition-all hover:scale-105 ${
                      pet === p.id ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <div className="text-4xl mb-2">{p.emoji}</div>
                    <div className="text-sm font-medium">{p.name}</div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={back} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button onClick={next} disabled={step === 0 && !name.trim()}>
                {step === steps.length - 1 ? (saving ? 'Saving...' : "Let's Go!") : 'Next'}
                {step < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
