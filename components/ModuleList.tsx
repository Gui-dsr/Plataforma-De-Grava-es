
import React from 'react';
import type { Module } from '../types';
import ModuleItem from './ModuleItem';

interface ModuleListProps {
    modules: Module[];
}

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
    if (modules.length === 0) {
        return (
            <div className="text-center p-16 bg-white rounded-lg shadow-md">
                <i className="material-icons text-6xl text-slate-400 mb-4">search_off</i>
                <h3 className="text-xl font-semibold text-etep-blue">Nenhum resultado encontrado</h3>
                <p className="text-slate-500 mt-2">Tente ajustar seus termos de busca.</p>
            </div>
        );
    }

    return (
        <div>
            {modules.map((module) => (
                <ModuleItem key={module.nome} module={module} />
            ))}
        </div>
    );
};

export default ModuleList;
