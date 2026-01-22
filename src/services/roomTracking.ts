/**
 * Serviço para rastrear cliques nas salas do Escape Room
 * Envia dados para a segunda aba da planilha Google Sheets
 */

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "";

export type RoomName = "iluminado" | "matinta" | "tesouro";

export interface RoomClickData {
  room: RoomName;
  timestamp?: string;
}

export interface RoomClickResponse {
  success: boolean;
  message: string;
  counts?: {
    iluminado: number;
    matinta: number;
    tesouro: number;
  };
}

/**
 * Registra um clique em uma sala específica
 * Os dados são salvos na segunda aba da planilha como contador
 */
export const trackRoomClick = async (
  room: RoomName,
): Promise<RoomClickResponse> => {
  if (!SCRIPT_URL) {
    console.error("Google Script URL não configurada");
    return {
      success: false,
      message: "Configuração do Google Sheets não encontrada",
    };
  }

  try {
    const timestamp = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    // Envia dados via GET com parâmetros
    const params = new URLSearchParams({
      action: "trackRoom",
      room: room,
      timestamp: timestamp,
    });

    await fetch(`${SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });

    return {
      success: true,
      message: `Interesse registrado na sala ${room}!`,
    };
  } catch (error) {
    console.error("Erro ao registrar interesse:", error);
    return {
      success: false,
      message: "Erro ao registrar interesse. Tente novamente.",
    };
  }
};
