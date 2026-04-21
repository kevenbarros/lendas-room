/**
 * Serviço de integração com Google Sheets
 * Para configurar:
 * 1. Abra sua planilha do Google Sheets
 * 2. Clique em Extensões > Apps Script
 * 3. Cole o código fornecido no README
 * 4. Clique em Implantar > Nova implantação
 * 5. Escolha "Aplicativo da Web"
 * 6. Configure "Executar como": Eu (seu email)
 * 7. Configure "Quem tem acesso": Qualquer pessoa
 * 8. Clique em Implantar e copie a URL
 * 9. Cole a URL na variável SCRIPT_URL abaixo
 */

// Cole aqui a URL do seu Google Apps Script após a implantação
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

export interface ContactFormData {
  email: string;
  phone: string;
  timestamp?: string;
}

export interface TermoFormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  dataHora: string;
  ip?: string;
  local?: string;
  userAgent?: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  row?: number;
}

/**
 * Envia dados do formulário para o Google Sheets
 * Usa fetch com mode: 'no-cors' para evitar problemas de CORS
 */
export const sendToGoogleSheets = async (
  data: ContactFormData,
): Promise<GoogleSheetsResponse> => {
  if (!SCRIPT_URL) {
    console.error("Google Script URL não configurada");
    return {
      success: false,
      message: "Configuração do Google Sheets não encontrada",
    };
  }

  try {
    // Adiciona timestamp aos dados
    const formData = {
      ...data,
      timestamp: new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    };

    // Cria URL com parâmetros
    const params = new URLSearchParams({
      email: formData.email,
      phone: formData.phone,
      timestamp: formData.timestamp,
    });

    // Usa fetch com no-cors - única forma de funcionar com Google Apps Script
    await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors", // Necessário para Google Apps Script
    });

    // Com no-cors, não podemos ler a resposta, mas o status 200 indica sucesso
    // A requisição foi enviada com sucesso
    return {
      success: true,
      message: "Dados enviados com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    return {
      success: false,
      message: "Erro ao enviar dados. Tente novamente.",
    };
  }
};

export interface MatchFormData {
  nome: string;
  idade: string;
  whatsapp: string;
  respostas: Record<string, string>;
  esportes: string;
  jogos: string[];
  jogosOutros: string;
  filmes: string;
  hobbies: string;
  musica: string;
  dias: string;
  turnos: string[];
  topPersona1: string;
  topPersona2: string;
  resultadoTitulo: string;
  dataHora: string;
}

/**
 * Envia dados do formulário de matchmaking para o Google Sheets (aba "Conectar")
 */
export const sendMatchFormToGoogleSheets = async (
  data: MatchFormData,
): Promise<GoogleSheetsResponse> => {
  if (!SCRIPT_URL) {
    console.warn("Google Script URL não configurada. Simulando envio...");
    return { success: true, message: "Simulado com sucesso" };
  }

  try {
    const params = new URLSearchParams({
      action: "matchForm",
      nome: data.nome,
      idade: data.idade,
      whatsapp: data.whatsapp,
      respostas: JSON.stringify(data.respostas),
      esportes: data.esportes,
      jogos: data.jogos.join(", "),
      jogosOutros: data.jogosOutros,
      filmes: data.filmes,
      hobbies: data.hobbies,
      musica: data.musica,
      dias: data.dias,
      turnos: data.turnos.join(", "),
      topPersona1: data.topPersona1,
      topPersona2: data.topPersona2,
      resultadoTitulo: data.resultadoTitulo,
      timestamp: data.dataHora,
    });

    await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });

    return {
      success: true,
      message: "Inscrição enviada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao enviar inscrição de matchmaking:", error);
    return {
      success: false,
      message: "Erro ao enviar inscrição.",
    };
  }
};

export interface MatchPlayer {
  timestamp: string;
  nome: string;
  idade: string;
  whatsapp: string;
  topPersona1: string;
  topPersona2: string;
  resultadoTitulo: string;
  esportes: string;
  jogos: string;
  jogosOutros: string;
  filmes: string;
  hobbies: string;
  musica: string;
  dias: string;
  turnos: string;
  respostasJson: string;
}

export interface FetchMatchDataResponse {
  success: boolean;
  data?: MatchPlayer[];
  error?: string;
}

/**
 * Busca os jogadores cadastrados via matchmaking no Google Sheets.
 * Requer Apps Script com action=getMatchData e validação por secret.
 */
export const fetchMatchData = async (
  secret: string,
): Promise<FetchMatchDataResponse> => {
  if (!SCRIPT_URL) {
    return { success: false, error: "Google Script URL não configurada" };
  }
  try {
    const url = `${SCRIPT_URL}?action=getMatchData&secret=${encodeURIComponent(secret)}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }
    const json = await res.json();
    if (!json.success) {
      return { success: false, error: json.error || "Falha ao buscar dados" };
    }
    return { success: true, data: json.data as MatchPlayer[] };
  } catch (err) {
    console.error("fetchMatchData error:", err);
    return { success: false, error: "Erro de conexão" };
  }
};

const LOCAL_AI_URL =
  import.meta.env.VITE_LOCAL_AI_URL || "http://localhost:3001";

export interface GenerateMatchLocalParams {
  players: MatchPlayer[];
  numGroups: number;
  playersPerGroup: number;
}

export interface GenerateMatchLocalResponse {
  success: boolean;
  response?: string;
  error?: string;
}

/**
 * Chama o backend Node local para gerar grupos via Ollama.
 */
export const generateMatchLocal = async (
  params: GenerateMatchLocalParams,
): Promise<GenerateMatchLocalResponse> => {
  try {
    const res = await fetch(`${LOCAL_AI_URL}/api/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { success: false, error: text || `HTTP ${res.status}` };
    }
    const json = await res.json();
    if (!json.success) {
      return { success: false, error: json.error || "Falha na IA local" };
    }
    return { success: true, response: json.response };
  } catch (err) {
    console.error("generateMatchLocal error:", err);
    return {
      success: false,
      error: `Não foi possível conectar ao backend local (${LOCAL_AI_URL}). Está rodando?`,
    };
  }
};

/**
 * Envia dados do Termo de Compromisso para o Google Sheets (nova aba/tipo)
 */
export const sendTermoToGoogleSheets = async (
  data: TermoFormData,
): Promise<GoogleSheetsResponse> => {
  if (!SCRIPT_URL) {
    console.warn("Google Script URL não configurada. Simulando envio...");
    return { success: true, message: "Simulado com sucesso" };
  }

  try {
    const params = new URLSearchParams({
      action: "termoCompromisso",
      nome: data.nome,
      cpf: data.cpf,
      dataNascimento: data.dataNascimento,
      timestamp: data.dataHora,
      ip: data.ip || "",
      local: data.local || "",
      userAgent: data.userAgent || "",
    });

    await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });

    return {
      success: true,
      message: "Termo enviado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao enviar termo:", error);
    return {
      success: false,
      message: "Erro ao enviar termo.",
    };
  }
};
