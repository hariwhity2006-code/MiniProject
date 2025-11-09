import React from 'react';

const SignatureIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 300 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10,70 Q25,30 50,50 T90,60 Q100,80 120,60 T150,70 Q170,50 190,70 T230,60 Q250,90 270,50 T290,70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export default SignatureIcon;