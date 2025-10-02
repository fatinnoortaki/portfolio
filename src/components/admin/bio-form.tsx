'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { generateBioContent } from '@/ai/flows/generate-bio-content';
import { saveBioClient } from '@/lib/client-actions';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Upload } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import type { FunFact } from '@/lib/definitions';

type AboutData = {
  bio: string;
  photoUrl: string;
  funFacts: FunFact[];
};

export function BioForm() {
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();

  const aboutRef = useMemoFirebase(() => firestore ? doc(firestore, 'about', 'main') : null, [firestore]);
  const { data: aboutData, isLoading: isLoadingData } = useDoc<AboutData>(aboutRef);

  const [bio, setBio] = useState('');
  const [userInput, setUserInput] = useState('');
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (aboutData) {
      setBio(aboutData.bio || '');
      setFunFacts(aboutData.funFacts || []);
      setProfilePhotoUrl(aboutData.photoUrl || '');
    }
  }, [aboutData]);

  const handleGenerateBio = () => {
    startGeneratingTransition(async () => {
      if (!userInput.trim()) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please provide some details about yourself.' });
        return;
      }
      try {
        const { suggestedBio } = await generateBioContent({ userInput });
        setBio(suggestedBio);
        toast({ title: 'Success', description: 'New bio content generated!' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate bio content.' });
      }
    });
  };

  const handleSaveChanges = () => {
    startSavingTransition(async () => {
      try {
        if (localPhoto) {
          toast({
            variant: 'destructive',
            title: 'Upload Not Supported',
            description: 'Image upload is not supported in this version. Please paste a URL instead.',
          });
          return;
        }

        await saveBioClient(firestore, bio, funFacts, profilePhotoUrl);
        toast({ title: 'Success', description: 'Bio updated successfully.' });

      } catch (error) {
         console.error('Error saving bio:', error);
         const message = error instanceof Error ? error.message : 'An unknown error occurred.';
         toast({ variant: 'destructive', title: 'Error', description: message });
      }
    });
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalPhoto(reader.result as string);
        setProfilePhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfilePhotoUrl(e.target.value);
    setLocalPhoto(null);
  };
  
  if (isLoadingData) {
    return (
       <Card>
          <CardHeader>
             <Skeleton className="h-8 w-40" />
             <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
               <Skeleton className="h-4 w-16" />
               <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
          <CardFooter>
             <Skeleton className="h-10 w-32" />
          </CardFooter>
       </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>Manage your biography, photo, and fun facts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center gap-4">
              {profilePhotoUrl && <Image src={profilePhotoUrl} alt="Profile Preview" width={80} height={80} className="rounded-full object-cover border" />}
              <div className="flex-grow space-y-2">
                <Input 
                    type="url"
                    placeholder="Paste image URL"
                    value={localPhoto ? '' : profilePhotoUrl}
                    onChange={handleUrlChange}
                />
                <Input id="photoUpload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Button asChild variant="outline">
                  <Label htmlFor="photoUpload" className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Label>
                </Button>
              </div>
            </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Your Bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={6} />
        </div>
        <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
          <Label htmlFor="userInput">Generate with AI</Label>
          <p className="text-sm text-muted-foreground">
            Write a few sentences about yourself, your skills, or your goals. Our AI will craft a professional bio for you.
          </p>
          <Textarea
            id="userInput"
            placeholder="e.g., I'm a software developer from New York who loves building serverless applications and hiking."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleGenerateBio} disabled={isGenerating}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Bio'}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
            <Label>Fun Facts</Label>
            {funFacts.map((fact, index) => (
                <div key={index} className="flex gap-2 items-center">
                    <Input value={fact.icon} onChange={(e) => {
                        const newFacts = [...funFacts];
                        newFacts[index].icon = e.target.value;
                        setFunFacts(newFacts);
                    }} className="w-16 text-center" />
                    <Input value={fact.text} onChange={(e) => {
                        const newFacts = [...funFacts];
                        newFacts[index].text = e.target.value;
                        setFunFacts(newFacts);
                    }} />
                </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
}
