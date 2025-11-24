
import React, { useState } from 'react';
import type { Module } from '../types';
import VideoItem from './VideoItem';
import SubModuleItem from './SubModuleItem';
import ChevronDownIcon from './icons/ChevronDownIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';

interface ModuleItemProps {
    module: Module;
}

const ModuleItem: React.FC<ModuleItemProps> = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);

    const totalAulas = module.aulas.length + module.submodulos.reduce((acc, sm) => acc + sm.aulas.length, 0);

    return (
        <div className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-etep-blue overflow-hidden">
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <VideoCameraIcon />
                    </div>
                    <h2 className="text-md md:text-lg font-semibold text-etep-blue uppercase">
                        {module.nome}
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 hidden md:inline">{totalAulas} aula(s)</span>
                    <ChevronDownIcon isOpen={isOpen} />
                </div>
            </div>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`} // Aumentado o max-h
            >
                <div className="py-2 px-4">
                    {module.submodulos.map((submodule) => (
                        <SubModuleItem key={submodule.nome} submodule={submodule} />
                    ))}
                    {module.aulas.map((aula) => (
                        <VideoItem key={aula.nome} video={aula} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModuleItem;