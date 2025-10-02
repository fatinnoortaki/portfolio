import type { SVGProps } from 'react';

export const Icons = {
  gitHub: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.0-1.25-.5-2.5-1-3.5.0-.5.5-2-1-3-1.5 0-3 1.5-3 1.5-1 0-2 .5-3 .5s-2-.5-3-.5c0 0-1.5-1.5-3-1.5-1.5 1-1 2.5-1 3-.5 1-1 2.25-1 3.5.0 3.5 3 5.5 6 5.5-1 1-1 2-1 3.5V22" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  linkedIn: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-2.8 1.4c-.7 0-1.4-1.4-2.8-1.4-1.4 0-2.8 1.4-2.8 1.4s-1.4-1.4-2.8-1.4-2.8 1.4-2.8 1.4-1.4-1.4-2.8-1.4c-1.4 0-2.8 1.4-2.8 1.4s.7-2.1 2-3.4c-1.5-1.4-3.3-4.4-3.3-4.4s1.4-1.4 2.8-1.4c.7 0 1.4 1.4 2.8 1.4 1.4 0 2.8-1.4 2.8-1.4s1.4 1.4 2.8 1.4c1.4 0 2.8-1.4 2.8-1.4z" />
    </svg>
  ),
};
