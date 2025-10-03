'use client';

import { TypeAnimation } from 'react-type-animation';
import { useState, useEffect } from 'react';

type TypewriterProps = {
    text: string;
    className?: string;
};

const SESSION_STORAGE_KEY = 'typewriter_animation_done';

export function Typewriter({ text, className }: TypewriterProps) {
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const animationDone = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (animationDone) {
            setHasAnimated(true);
        }
    }, []);

    if (hasAnimated) {
        return <span className={className}>{text}</span>;
    }

    return (
        <TypeAnimation
            sequence={[
                text,
                () => {
                    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
                    setHasAnimated(true);
                }
            ]}
            wrapper="span"
            cursor={true}
            repeat={0}
            className={className}
        />
    );
}
