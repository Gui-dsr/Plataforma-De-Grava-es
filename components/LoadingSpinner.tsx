
import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-16">
        <div className="w-16 h-16 border-4 border-etep-orange border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-etep-blue font-semibold">Carregando vídeos...</p>
    </div>
);

export default LoadingSpinner;
