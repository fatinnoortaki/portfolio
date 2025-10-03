'use client';

import { TypeAnimation } from 'react-type-animation';

type TypewriterProps = {
    text: string;
    className?: string;
};

export function Typewriter({ text, className }: TypewriterProps) {
    return (
        <TypeAnimation
            sequence={[text]}
            wrapper="span"
            cursor={true}
            repeat={0}
            className={className}
        />
    );
}
