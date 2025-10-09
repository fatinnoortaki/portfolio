'use client';

import { useState, useEffect } from 'react';
import { portfolioData } from '@/lib/data';
import type { Quote } from '@/lib/definitions';
import { Quote as QuoteIcon } from 'lucide-react';

export function QuoteSection() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // This code now runs only on the client, after the initial render.
    // This prevents a mismatch between server and client rendered HTML.
    const randomIndex = Math.floor(Math.random() * portfolioData.quotes.length);
    setQuote(portfolioData.quotes[randomIndex]);
  }, []); // The empty dependency array ensures this runs only once on mount.

  // Render a placeholder or nothing on the server and initial client render
  if (!quote) {
    // You can return a loading skeleton here if you prefer
    return <div className="w-full max-w-2xl mx-auto my-8 h-[124px]" />;
  }

  // Once the component has mounted on the client, render the quote
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
        <blockquote className="relative p-4 text-lg italic border-l-4 bg-muted text-center rounded-r-lg">
            <QuoteIcon className="absolute top-2 left-2 h-6 w-6 text-primary/30 transform -scale-x-100" />
            <p className="mb-2 px-4">&ldquo;{quote.text}&rdquo;</p>
            <QuoteIcon className="absolute bottom-2 right-2 h-6 w-6 text-primary/30" />
            <cite className="block text-sm not-italic font-semibold text-foreground/70 mt-4">&mdash; {quote.author}</cite>
        </blockquote>
    </div>
  );
}
