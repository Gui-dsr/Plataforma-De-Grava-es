
import React, { useState, useMemo } from 'react';
import { useVideoData } from './hooks/useVideoData';
import type { Module, SubModule } from './types';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ModuleList from './components/ModuleList';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
    const { modules, loading, error } = useVideoData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredModules = useMemo(() => {
        if (!searchTerm.trim()) {
            return modules;
        }
        const lowercasedFilter = searchTerm.toLowerCase();

        return modules
            .map(module => {
                // Se o nome do módulo principal (professor) corresponder, retorna o módulo inteiro
                if (module.nome.toLowerCase().includes(lowercasedFilter)) {
                    return module;
                }

                // Filtra as aulas na raiz do módulo
                const matchingAulas = module.aulas.filter(aula =>
                    aula.nome.toLowerCase().includes(lowercasedFilter)
                );

                // Filtra os submódulos (meses) e as aulas dentro deles
                const matchingSubmodules = (module.submodulos || [])
                    .map(submodule => {
                        // Se o nome do submódulo (mês) corresponder, retorna o submódulo inteiro
                        if (submodule.nome.toLowerCase().includes(lowercasedFilter)) {
                            return submodule;
                        }
                        
                        // Filtra as aulas dentro do submódulo
                        const matchingSubAulas = submodule.aulas.filter(aula =>
                            aula.nome.toLowerCase().includes(lowercasedFilter)
                        );

                        // Se encontrou aulas correspondentes, retorna um novo objeto de submódulo com elas
                        if (matchingSubAulas.length > 0) {
                            return { ...submodule, aulas: matchingSubAulas };
                        }

                        return null; // Nenhum resultado neste submódulo
                    })
                    .filter((submodule): submodule is SubModule => submodule !== null); // Remove os nulos

                // Se houver qualquer correspondência (aulas na raiz ou submódulos), retorna um novo objeto de módulo
                if (matchingAulas.length > 0 || matchingSubmodules.length > 0) {
                    return { ...module, aulas: matchingAulas, submodulos: matchingSubmodules };
                }

                return null; // Nenhuma correspondência neste módulo
            })
            .filter((module): module is Module => module !== null); // Filtra os módulos nulos
    }, [modules, searchTerm]);

    const renderContent = () => {
        if (loading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <div className="text-center p-16 bg-red-100 text-red-700 rounded-lg">{error}</div>;
        }
        return <ModuleList modules={filteredModules} />;
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <div className="container mx-auto max-w-5xl px-4 py-8">
                <Header />
                <main>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;