'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/actions';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleAuthAction = async (
    data: LoginFormValues,
    isSignUp: boolean
  ) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const result = await createUser(user.uid, user.email);

        if (!result.success) {
            // This is a server-side error, need to handle it.
            // For now, we will sign the user out and show a generic error.
             await auth.signOut();
             throw new Error(result.message || 'Failed to create user record.');
        }

        if (result.isAdmin) {
          toast({
            title: 'Admin Account Created!',
            description: 'You have been made the first administrator.',
          });
        } else {
          toast({
            title: 'Success!',
            description: 'Your account has been created.',
          });
        }
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: 'Success!',
          description: 'You are now logged in.',
        });
      }
      router.push('/admin');
    } catch (error: any) {
      if (isSignUp && auth.currentUser) {
          await auth.signOut();
      }
      setAuthError(error.message);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'This email is already in use.'
            : error.code === 'auth/invalid-credential'
            ? 'Invalid email or password.'
            : 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLogin = (data: LoginFormValues) => handleAuthAction(data, false);
  const onSignUp = (data: LoginFormValues) => handleAuthAction(data, true);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">
          <LogIn className="inline-block mr-2" />
          Admin Panel
        </CardTitle>
        <CardDescription>
          Login or create an account to manage your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleSubmit(onLogin)} className="space-y-4 pt-4">
              <AuthFields register={register} errors={errors} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSubmit(onSignUp)} className="space-y-4 pt-4">
              <AuthFields register={register} errors={errors} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        {authError && (
          <p className="text-sm font-medium text-destructive mt-4 text-center">
            {authError}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function AuthFields({ register, errors }: any) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>
    </>
  );
}
