'use client';
import { useState, useTransition } from 'react';
import { portfolioData } from '@/lib/data';
import type { Experience, Education } from '@/lib/definitions';
import { generateResumeSummary } from '@/ai/flows/generate-resume-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Briefcase, GraduationCap, PlusCircle, Trash } from 'lucide-react';

export function ResumeAdmin() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [experiences, setExperiences] = useState<Experience[]>(portfolioData.experiences);
  const [educations, setEducations] = useState<Education[]>(portfolioData.educations);
  const [summary, setSummary] = useState('');

  const handleGenerateSummary = () => {
    startTransition(async () => {
      const expText = experiences.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n');
      const eduText = educations.map(e => `${e.degree} from ${e.institution}`).join('\n');
      if (!expText || !eduText) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please add at least one experience and education item.' });
        return;
      }
      try {
        const { summary: generatedSummary } = await generateResumeSummary({ experience: expText, education: eduText });
        setSummary(generatedSummary);
        toast({ title: 'Success', description: 'Resume summary generated!' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate summary.' });
      }
    });
  };

  const addExperience = () => setExperiences([...experiences, { id: `exp-${Date.now()}`, role: '', company: '', period: '', description: '' }]);
  const addEducation = () => setEducations([...educations, { id: `edu-${Date.now()}`, degree: '', institution: '', period: '' }]);
  
  const removeExperience = (id: string) => setExperiences(experiences.filter(e => e.id !== id));
  const removeEducation = (id: string) => setEducations(educations.filter(e => e.id !== id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> Work Experience</CardTitle>
              <CardDescription>Manage your professional experience entries.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addExperience}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.map((exp, index) => (
            <Card key={exp.id} className="bg-muted/50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Role" defaultValue={exp.role} />
                <Input placeholder="Company" defaultValue={exp.company} />
                <Input placeholder="Period (e.g., 2020-Present)" defaultValue={exp.period} className="col-span-2" />
                <Textarea placeholder="Description" defaultValue={exp.description} className="col-span-2" />
              </div>
              <div className="flex justify-end mt-2">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => removeExperience(exp.id)}><Trash className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Education</CardTitle>
              <CardDescription>Manage your educational background.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addEducation}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {educations.map((edu) => (
            <Card key={edu.id} className="bg-muted/50 p-4">
               <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Degree" defaultValue={edu.degree} />
                <Input placeholder="Institution" defaultValue={edu.institution} />
                <Input placeholder="Period (e.g., 2014-2016)" defaultValue={edu.period} className="col-span-2" />
              </div>
               <div className="flex justify-end mt-2">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => removeEducation(edu.id)}><Trash className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Resume Summary</CardTitle>
          <CardDescription>Generate a professional summary based on your experience and education.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea id="summary" placeholder="Your generated summary will appear here..." value={summary} readOnly rows={5} />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleGenerateSummary} disabled={isPending}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isPending ? 'Generating...' : 'Generate Summary'}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
            <Button>Save All Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
