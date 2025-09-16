
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5V13H8v-2h3V8.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5v1H16v2h-1.5v3.5c0 1.93-1.57 3.5-3.5 3.5S11 18.43 11 16.5z"/>
        <path d="M13.5 7c.83 0 1.5.67 1.5 1.5v1h-3V8.5c0-.83.67-1.5 1.5-1.5z" opacity=".3"/>
        <path d="M13.5 18c-.83 0-1.5-.67-1.5-1.5V13h3v3.5c0 .83-.67 1.5-1.5 1.5z" opacity=".3"/>
    </svg>
);
