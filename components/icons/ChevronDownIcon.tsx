
import React from 'react';

interface ChevronDownIconProps extends React.SVGProps<SVGSVGElement> {
    isOpen: boolean;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ isOpen, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`w-6 h-6 text-etep-blue transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

export default ChevronDownIcon;
