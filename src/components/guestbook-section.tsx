'use client';

import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { signInAnonymously } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

type GuestbookMessage = {
    id: string;
    message: string;
    author: string;
    createdAt: Date;
    photoURL: string | null;
};

function MessageSkeleton() {
    return (
        <div className="flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    )
}

function Message({ msg }: { msg: GuestbookMessage }) {
    const formattedDate = msg.createdAt ? formatDistanceToNow(msg.createdAt, { addSuffix: true }) : 'just now';

    return (
        <div className="flex items-start gap-4">
            <Avatar className="h-8 w-8">
                <AvatarImage src={msg.photoURL || ''} alt={msg.author} />
                <AvatarFallback>{msg.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{msg.author}</p>
                    <time className="text-xs text-muted-foreground">{formattedDate}</time>
                </div>
                <p className="text-foreground/90">{msg.message}</p>
            </div>
        </div>
    )
}

function NameInputForm({ onNameSet }: { onNameSet: (name: string) => void }) {
    const auth = useAuth();
    const [name, setName] = useState('');

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !auth) return;

        try {
            await signInAnonymously(auth);
            localStorage.setItem('guestbook_author', name);
            onNameSet(name);
        } catch (error) {
            console.error("Anonymous sign-in failed", error);
        }
    };

    return (
        <form onSubmit={handleJoin} className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-foreground/80">Enter your name to join the chat.</p>
            <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name..."
                maxLength={50}
                className="max-w-xs"
            />
            <Button type="submit" disabled={!name.trim()}>Join Chat</Button>
        </form>
    );
}

function UserDisplay({ author, onSignOut }: { author: string, onSignOut: () => void }) {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Signed in as <span className="font-semibold text-foreground">{author}</span></span>
            <Button variant="link" className="p-0 h-auto" onClick={onSignOut}>Sign Out</Button>
        </div>
    );
}


export function GuestbookSection() {
    const firestore = useFirestore();
    const auth = useAuth();
    const { data: user } = useUser();
    const [messages, setMessages] = useState<GuestbookMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [authorName, setAuthorName] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (user) {
            const storedName = localStorage.getItem('guestbook_author');
            if (storedName) {
                setAuthorName(storedName);
            }
        } else {
            setAuthorName(null);
            localStorage.removeItem('guestbook_author');
        }
    }, [user]);


    useEffect(() => {
        if (!firestore) return;
        setLoading(true);

        const q = query(
            collection(firestore, 'guestbook'),
            orderBy('createdAt', 'desc'), 
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    message: data.message,
                    author: data.author || 'Anonymous',
                    createdAt: data.createdAt?.toDate(),
                    photoURL: data.photoURL || null,
                };
            }).reverse(); // Reverse to show newest messages at the bottom
            setMessages(newMessages);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [firestore]);
    
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, loading]);


    const sendMessage = async () => {
        if (!firestore || !user || !newMessage.trim() || !authorName) return;

        document.body.classList.add('is-loading');
        try {
            await addDoc(collection(firestore, 'guestbook'), {
                message: newMessage,
                author: authorName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                uid: user.uid,
            });

            setNewMessage('');
            inputRef.current?.focus();
        } catch (error) {
            console.error("Error sending message: ", error);
        } finally {
            document.body.classList.remove('is-loading');
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        sendMessage();
    };


    const handleSignOut = () => {
        if (auth) {
            auth.signOut();
        }
        localStorage.removeItem('guestbook_author');
        setAuthorName(null);
    }

    const isChatReady = user && authorName;

    return (
        <section id="guestbook" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Guestbook</h2>
                        <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Leave a message for me and for future visitors!
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl py-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Real-time Chat</CardTitle>
                            <CardDescription>Messages will appear here as they are sent.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div ref={scrollContainerRef} className="h-80 overflow-y-auto space-y-6 p-4 border rounded-md custom-scrollbar">
                                {loading ? (
                                    <>
                                        <MessageSkeleton />
                                        <MessageSkeleton />
                                        <MessageSkeleton />
                                    </>
                                ) : (
                                    messages.map((msg) => (
                                        <Message key={msg.id} msg={msg} />
                                    ))
                                )}
                            </div>
                            <div className="mt-6">
                                {isChatReady ? (
                                    <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                                        <Input
                                            ref={inputRef}
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Write a message..."
                                            maxLength={280}
                                        />

                                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                            <Send className="h-4 w-4" />
                                            <span className="sr-only">Send</span>
                                        </Button>
                                    </form>
                                ) : (
                                    <NameInputForm onNameSet={setAuthorName} />
                                )}
                            </div>
                        </CardContent>
                        {isChatReady && 
                            <div className="p-6 pt-0 flex justify-end">
                                <UserDisplay author={authorName} onSignOut={handleSignOut} />
                            </div>
                        }
                    </Card>
                </div>
            </div>
        </section>
    );
}
