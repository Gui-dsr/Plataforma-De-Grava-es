// Define o e-mail do administrador para receber notificações
const EMAIL_ADMIN = "guilherme.santos@etepead.com.br"; 

// Lista de pastas a serem monitoradas
const PASTAS_MONITORADAS = [
  "prontos", // Nome em minúsculas para facilitar a correspondência
  "OFICINA: EXPRESSÃO EM CENA: CORPO, VOZ E COMUNICAÇÃO (2025)",
  "OFICINA: DESTRAVANDO A FALA (2025)"
];

// Lista de tipos de MIME de vídeo válidos
const MIME_TYPES_VIDEO = [
  "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", 
  "video/x-matroska", "video/x-flv", "video/3gpp", "video/x-ms-wmv"
];

// Lista de meses em maiúsculas para verificação de pastas
const MESES_DO_ANO = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", 
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

/**
 * Função principal que é executada quando o URL do App da Web é acessado (GET).
 * Limpa o histórico de vídeos para garantir que todos os vídeos sejam listados
 * e retorna os dados dos vídeos em formato JSON.
 */
function doGet() {
  try {
    // Limpa o histórico para garantir uma busca nova sempre que a API é chamada.
    PropertiesService.getScriptProperties().deleteProperty("historico_videos");
    Logger.log("🗑️ Histórico de vídeos limpo para nova busca.");

    const videos = listarVideosDrive();
    
    // Define o cabeçalho para retornar JSON e converte o objeto de vídeos para uma string JSON.
    return ContentService.createTextOutput(JSON.stringify(videos, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    Logger.log(`❌ Erro fatal em doGet: ${e.toString()}`);
    // Retorna uma resposta de erro em JSON
    return ContentService.createTextOutput(JSON.stringify({ error: "Falha ao buscar vídeos.", details: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Lista todos os vídeos encontrados nas pastas monitoradas que ainda não foram processados.
 * @returns {Array<Object>} Uma lista de objetos, cada um representando um vídeo.
 */
function listarVideosDrive() {
  const todasAsPastas = DriveApp.getFolders();
  const pastasFiltradas = [];
  
  // Itera por todas as pastas do Drive para encontrar as que correspondem aos nomes monitorados.
  while (todasAsPastas.hasNext()) {
    const pasta = todasAsPastas.next();
    const nomePasta = pasta.getName();
    if (PASTAS_MONITORADAS.includes(nomePasta) || nomePasta.toLowerCase() === "prontos") {
      Logger.log(`🔍 Pasta monitorada encontrada: "${nomePasta}"`);
      pastasFiltradas.push(pasta);
    }
  }
  
  if (pastasFiltradas.length === 0) {
    Logger.log("⚠️ Nenhuma pasta relevante foi encontrada.");
    return [];
  }
  
  const props = PropertiesService.getScriptProperties();
  const historicoVideos = JSON.parse(props.getProperty("historico_videos") || "[]");
  const novosVideos = [];
  
  pastasFiltradas.forEach(pasta => {
    const nomePastaAtual = pasta.getName();
    if (nomePastaAtual.toLowerCase() === "prontos") {
      // Para a pasta "prontos", usamos uma busca recursiva
      processarPastaProntos(pasta, historicoVideos, novosVideos);
    } else {
      // Para outras pastas (oficinas), processamos apenas os arquivos na raiz da pasta
      try {
        Logger.log(`📂 Acessando pasta de oficina: ${nomePastaAtual}`);
        const arquivos = pasta.getFiles();
        
        while (arquivos.hasNext()) {
          const arquivo = arquivos.next();
          const mimeType = arquivo.getMimeType();
          const linkArquivo = arquivo.getUrl();

          if (MIME_TYPES_VIDEO.includes(mimeType) && !historicoVideos.includes(linkArquivo)) {
            novosVideos.push({
              nome: arquivo.getName(),
              link: linkArquivo,
              grupo: nomePastaAtual, // O grupo é o nome da pasta da oficina
              dataUpload: arquivo.getDateCreated().toISOString()
            });
            historicoVideos.push(linkArquivo);
          }
        }
      } catch (erro) {
        Logger.log(`❌ Erro ao acessar a pasta ${nomePastaAtual}: ${erro.toString()}`);
      }
    }
  });
  
  props.setProperty("historico_videos", JSON.stringify(historicoVideos));
  Logger.log(`✅ ${novosVideos.length} novos vídeos encontrados.`);
  return novosVideos;
}

/**
 * Processa recursivamente a pasta "prontos" e suas subpastas para encontrar vídeos.
 * @param {GoogleAppsScript.Drive.Folder} pasta A pasta a ser processada.
 * @param {Array<string>} historicoVideos Array com os links dos vídeos já processados.
 * @param {Array<Object>} novosVideos Array para adicionar os novos vídeos encontrados.
 */
function processarPastaProntos(pasta, historicoVideos, novosVideos) {
  Logger.log(`📂 Processando pasta recursivamente: "${pasta.getName()}"`);
  try {
    // 1. Processar arquivos na pasta atual
    const arquivos = pasta.getFiles();
    while (arquivos.hasNext()) {
      const arquivo = arquivos.next();
      const mimeType = arquivo.getMimeType();
      const linkArquivo = arquivo.getUrl();

      if (MIME_TYPES_VIDEO.includes(mimeType) && !historicoVideos.includes(linkArquivo)) {
        const donoEmail = arquivo.getOwner().getEmail();
        const nomeProfessor = `PROFESSOR(A) ${formatarNomeProfessor(donoEmail)}`;
        let subgrupo = null;

        // Pega a pasta pai do arquivo
        const pastaPai = arquivo.getParents().next();
        const nomePastaPai = pastaPai.getName().toUpperCase();

        // Verifica se a pasta pai é uma pasta de mês e não é a própria "prontos"
        if (MESES_DO_ANO.includes(nomePastaPai) && pastaPai.getName().toLowerCase() !== 'prontos') {
           subgrupo = nomePastaPai;
           Logger.log(`🗓️ Subpasta de mês encontrada: "${nomePastaPai}" para o vídeo "${arquivo.getName()}".`);
        }

        novosVideos.push({
          nome: arquivo.getName(),
          link: linkArquivo,
          grupo: nomeProfessor,
          subgrupo: subgrupo,
          dataUpload: arquivo.getDateCreated().toISOString()
        });
        historicoVideos.push(linkArquivo);
      }
    }

    // 2. Chamar recursivamente para cada subpasta
    const subpastas = pasta.getFolders();
    while (subpastas.hasNext()) {
      processarPastaProntos(subpastas.next(), historicoVideos, novosVideos);
    }
  } catch (erro) {
    Logger.log(`❌ Erro ao processar recursivamente a pasta ${pasta.getName()}: ${erro.toString()}`);
  }
}


/**
 * Formata o e-mail do professor para um nome em maiúsculas, removendo o domínio.
 * @param {string} email O e-mail do proprietário do arquivo.
 * @returns {string} O nome do professor formatado.
 */
function formatarNomeProfessor(email) {
  if (!email) return "DESCONHECIDO";
  const nomeSemDominio = email.split('@')[0];
  const nomeFormatado = nomeSemDominio.replace(/\./g, " ");
  return nomeFormatado.toUpperCase();
}

/**
 * Função de monitoramento (pode ser usada com um gatilho de tempo) para notificar sobre novos vídeos.
 * Esta função não é chamada pelo doGet, mas pode ser configurada para rodar periodicamente.
 */
function monitorarEnotificar() {
    const videos = listarVideosDrive();
    if (videos.length > 0) {
        enviarEmailNotificacao(videos, EMAIL_ADMIN);
    } else {
        Logger.log("ℹ️ Nenhum novo vídeo para notificar.");
    }
}

/**
 * Envia um e-mail de notificação com a lista de novos vídeos.
 * @param {Array<Object>} videos Lista de vídeos para incluir no e-mail.
 * @param {string} destinatario O e-mail para onde a notificação será enviada.
 */
function enviarEmailNotificacao(videos, destinatario) {
  const assunto = "📢 Novo vídeo de aula foi adicionado!";
  let corpo = "Os seguintes vídeos foram adicionados à plataforma:\n\n";

  videos.forEach(video => {
    corpo += `🎥 ${video.nome} (Grupo: ${video.grupo})\n🔗 ${video.link}\n\n`;
  });

  MailApp.sendEmail(destinatario, assunto, corpo);
  Logger.log(`📩 Notificação enviada para ${destinatario}.`);
}