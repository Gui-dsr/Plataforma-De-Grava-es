
export interface Video {
  nome: string;
  link: string;
  dataUpload: Date;
}

export interface SubModule {
  nome: string;
  aulas: Video[];
}

export interface Module {
  nome: string;
  aulas: Video[];
  submodulos: SubModule[];
  ultimaAtualizacao: Date;
}