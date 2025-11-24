
import React, { useState } from 'react';
import type { SubModule } from '../types';
import VideoItem from './VideoItem';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface SubModuleItemProps {
    submodule: SubModule;
}

const SubModuleItem: React.FC<SubModuleItemProps> = ({ submodule }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (submodule.aulas.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-50 rounded-md mb-3 border border-slate-200 overflow-hidden">
            <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                     <i className="material-icons text-etep-orange text-xl">folder_open</i>
                    <h3 className="text-sm font-semibold text-etep-blue uppercase">
                        {submodule.nome}
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{submodule.aulas.length} aula(s)</span>
                    <ChevronDownIcon isOpen={isOpen} />
                </div>
            </div>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
                 <div className="border-t border-slate-200">
                    {submodule.aulas.map((aula) => (
                        <VideoItem key={aula.nome} video={aula} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubModuleItem;
