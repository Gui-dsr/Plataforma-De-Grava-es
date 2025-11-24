
import { useState, useEffect } from 'react';
import type { Video, Module, SubModule } from '../types';

// ❗ IMPORTANTE: Cole aqui a URL do seu App da Web do Google Apps Script.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzX4amDb0nJYHSr2SrrpQyTSMoIuzq7Tf6CQB0fyr2nE0IPdfN4a0L1RtOPgyg2kk/exec';

// Define um tipo para os dados brutos que vêm da API
interface RawVideo {
  nome: string;
  link: string;
  grupo: string;
  subgrupo?: string; // Subgrupo é opcional
  dataUpload: string; // Formato de string ISO
}

export const useVideoData = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(SCRIPT_URL);
        if (!response.ok) {
          throw new Error(`Erro na rede: ${response.status} - ${response.statusText}`);
        }
        const rawVideos: RawVideo[] = await response.json();

        if (!Array.isArray(rawVideos)) {
          throw new Error("A resposta da API não é um array válido.");
        }

        const modulosMap: { [key: string]: Module } = {};

        rawVideos.forEach((video) => {
          const moduloNome = video.grupo || "Geral";
          
          // Cria o módulo principal se não existir
          if (!modulosMap[moduloNome]) {
            modulosMap[moduloNome] = {
              nome: moduloNome,
              aulas: [],
              submodulos: [],
              ultimaAtualizacao: new Date(0),
            };
          }
          
          const dataUpload = new Date(video.dataUpload);
          if (dataUpload > modulosMap[moduloNome].ultimaAtualizacao) {
            modulosMap[moduloNome].ultimaAtualizacao = dataUpload;
          }
          
          const videoData: Video = {
            nome: video.nome,
            link: video.link,
            dataUpload: dataUpload,
          };

          // Se houver um subgrupo (mês), agrupa o vídeo dentro dele
          if (video.subgrupo) {
            const subModuloNome = video.subgrupo;
            let subModulo = modulosMap[moduloNome].submodulos.find(sm => sm.nome === subModuloNome);
            
            if (!subModulo) {
              subModulo = { nome: subModuloNome, aulas: [] };
              modulosMap[moduloNome].submodulos.push(subModulo);
            }
            subModulo.aulas.push(videoData);
          } else {
            // Caso contrário, adiciona à lista de aulas raiz do módulo
            modulosMap[moduloNome].aulas.push(videoData);
          }
        });

        const sortedModulos = Object.values(modulosMap).sort((a, b) => b.ultimaAtualizacao.getTime() - a.ultimaAtualizacao.getTime());
        
        // Ordena as aulas dentro de cada módulo e submódulo
        sortedModulos.forEach(modulo => {
            modulo.aulas.sort((a, b) => b.dataUpload.getTime() - a.dataUpload.getTime());
            modulo.submodulos.forEach(submodulo => {
                submodulo.aulas.sort((a, b) => b.dataUpload.getTime() - a.dataUpload.getTime());
            });
            // Ordena os submódulos (meses) se necessário - aqui deixamos na ordem de aparição
        });

        setModules(sortedModulos);
      } catch (err) {
        if (err instanceof Error) {
            setError(`Falha ao buscar os vídeos: ${err.message}. Verifique a URL e sua conexão.`);
        } else {
            setError("Ocorreu um erro desconhecido ao buscar os vídeos.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessVideos();
  }, []);

  return { modules, loading, error };
};