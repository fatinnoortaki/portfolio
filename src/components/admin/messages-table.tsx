'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { ContactMessage } from '@/lib/definitions';
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
import { Skeleton } from '../ui/skeleton';

export function MessagesTable() {
  const firestore = useFirestore();
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contactMessages'), orderBy('sentAt', 'desc'));
  }, [firestore]);

  const { data: messages, isLoading } = useCollection<ContactMessage>(messagesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>
          Messages submitted through your contact form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
           <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
           </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Received</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-full">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? (
              messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="whitespace-nowrap">
                    {msg.sentAt ? new Date(msg.sentAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>{msg.message}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No messages received yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
