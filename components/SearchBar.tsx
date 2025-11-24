import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <div className="relative mb-8">
            <i className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</i>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar por módulo ou nome da aula..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full shadow-md focus:ring-2 focus:ring-etep-orange focus:border-etep-orange outline-none transition-shadow"
            />
        </div>
    );
};

export default SearchBar;