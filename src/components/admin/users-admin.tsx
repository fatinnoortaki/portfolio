'use client';
import { useState, useEffect, useTransition } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { toggleAdminRole } from '@/lib/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

type UserProfile = {
  uid: string;
  email: string;
};

type AdminRole = {
  id: string;
};

export function UsersAdmin() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const adminsQuery = useMemoFirebase(() => collection(firestore, 'roles_admin'), [firestore]);

  const { data: users, isLoading: usersLoading } = useCollection<UserProfile>(usersQuery);
  const { data: admins, isLoading: adminsLoading } = useCollection<AdminRole>(adminsQuery);

  const [userRoles, setUserRoles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (admins) {
      const roles = admins.reduce((acc, admin) => {
        acc[admin.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setUserRoles(roles);
    }
  }, [admins]);

  const handleRoleChange = (uid: string, isAdmin: boolean) => {
    setUserRoles(prev => ({...prev, [uid]: isAdmin }));
    startTransition(async () => {
      const result = await toggleAdminRole(uid, isAdmin);
      if (result.success) {
        toast({ title: 'Success', description: `User role updated.` });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
        // Revert on failure
        setUserRoles(prev => ({...prev, [uid]: !isAdmin }));
      }
    });
  };

  const isLoading = usersLoading || adminsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Assign or revoke admin privileges for registered users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>UID</TableHead>
              <TableHead className="text-right">Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell className="font-mono text-xs">{user.uid}</TableCell>
                <TableCell className="text-right">
                   <Switch
                    checked={!!userRoles[user.uid]}
                    onCheckedChange={(isChecked) => handleRoleChange(user.uid, isChecked)}
                    disabled={isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
