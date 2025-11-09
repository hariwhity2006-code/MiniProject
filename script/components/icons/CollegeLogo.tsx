import React from 'react';

const CollegeLogo: React.FC<{ className?: string }> = ({ className = 'h-16 w-16' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="48" fill="#005a9c" stroke="#e3f2fd" strokeWidth="4" />
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fill="white"
            fontSize="40"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
        >
            SEC
        </text>
    </svg>
);

export default CollegeLogo;