'use client';

import { useState, useEffect } from 'react';
import { portfolioData } from '@/lib/data';
import type { Quote } from '@/lib/definitions';
import { Quote as QuoteIcon } from 'lucide-react';

export function QuoteSection() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Select a random quote on component mount
    const randomIndex = Math.floor(Math.random() * portfolioData.quotes.length);
    setQuote(portfolioData.quotes[randomIndex]);
  }, []);

  if (!quote) {
    return null; // Don't render anything until a quote is selected
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
        <blockquote className="relative p-4 text-lg italic border-l-4 bg-muted text-center rounded-r-lg">
            <QuoteIcon className="absolute top-2 left-2 h-6 w-6 text-primary/30 transform -scale-x-100" />
            <p className="mb-2 px-4">&ldquo;{quote.text}&rdquo;</p>
            <QuoteIcon className="absolute bottom-2 right-2 h-6 w-6 text-primary/30" />
            <cite className="block text-sm not-italic font-semibold text-foreground/70 mt-4">&mdash; {quote.author}</cite>
        </blockquote>
    </div>
  );
}
