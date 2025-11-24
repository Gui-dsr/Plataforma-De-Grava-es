
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="py-6 px-4 md:px-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-etep-blue uppercase tracking-wider">
                    Plataforma de Gravações
                </h1>
                <a
                    href="https://drive.google.com/drive/folders/1SEA9XISZSg72BTX-xKVyH_5Mo8VBHt_B"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white text-etep-blue px-4 py-2 rounded-full shadow-md hover:bg-etep-blue hover:text-white transition-all duration-300 text-sm font-semibold"
                    title="Ir para gravações antigas"
                >
                    <span>Gravações antigas</span>
                    <i className="material-icons text-base">open_in_new</i>
                </a>
            </div>
             <div className="w-24 h-1 bg-etep-orange"></div>
        </header>
    );
};

export default Header;
